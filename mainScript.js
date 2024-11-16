// Global Variablres

const WinWidth = window.innerWidth;
const WinHeight = window.innerHeight;
const BoxSize = WinWidth > 700 ? 30 : 20;
const Time_step = 100;//time for each frame in (ms)
const Graph = {};
let selected = '';


const grid_width = Math.floor((WinWidth / BoxSize) -2);
const grid_height = Math.floor((WinHeight / BoxSize)/1.2);

const grid_div = document.querySelector('.grid');
let [Rand_start_x,Rand_start_y,Rand_end_x,Rand_end_y] = start_end_cell(); 

function start_end_cell(){
    let Rand_start_x = Math.floor(Math.random()*(grid_width - 2)) + 1;
    let Rand_start_y = Math.floor(Math.random()*(grid_height - 2)) + 1;
    let Rand_end_x = Math.floor(Math.random()*(grid_width - 2)) + 1;
    let Rand_end_y = Math.floor(Math.random()*(grid_height - 2)) + 1;
     

    return [Rand_start_x,Rand_start_y,Rand_end_x,Rand_end_y]

}



function create_grid() {
    const fragment = document.createDocumentFragment();


    for (let y = 0; y < grid_height; y++) {
        for (let x = 0; x < grid_width; x++) {
            let child = document.createElement('div');
            if(x == 0 || x >= grid_width - 1 || y == 0 || y >= grid_height - 1){
                child.classList.add('wall_cell');
            }else if(x == Rand_end_x && y == Rand_end_y){
                Graph[`x = ${x},y = ${y}`] = [
                    `x = ${x+1},y = ${y}`,
                    `x = ${x-1},y = ${y}`,
                    `x = ${x},y = ${y+1}`,
                    `x = ${x},y = ${y-1}`,
                    `x = ${x+1},y = ${y+1}`,
                    `x = ${x-1},y = ${y-1}`,
                    `x = ${x+1},y = ${y-1}`,
                    `x = ${x-1},y = ${y+1}`
                ];
                child.classList.add('end_cell');
                child.style.backgroundImage = "url('./icons/end.png')";
                child.style.backgroundRepeat = 'no-repeat';
                child.style.backgroundSize = '100% 100%';
            }else if(x == Rand_start_x && y == Rand_start_y){
                Graph[`x = ${x},y = ${y}`] = [
                    `x = ${x+1},y = ${y}`,
                    `x = ${x-1},y = ${y}`,
                    `x = ${x},y = ${y+1}`,
                    `x = ${x},y = ${y-1}`,
                    `x = ${x+1},y = ${y+1}`,
                    `x = ${x-1},y = ${y-1}`,
                    `x = ${x+1},y = ${y-1}`,
                    `x = ${x-1},y = ${y+1}`
                ];
                child.classList.add('start_cell');
                child.classList.remove('route_cell');
                child.style.backgroundImage = "url('./icons/start.png')";
                child.style.backgroundRepeat = 'no-repeat';
                child.style.backgroundSize = '100% 100%';
            }
            else{
                Graph[`x = ${x},y = ${y}`] = [
                    `x = ${x+1},y = ${y}`,
                    `x = ${x-1},y = ${y}`,
                    `x = ${x},y = ${y+1}`,
                    `x = ${x},y = ${y-1}`,
                    `x = ${x+1},y = ${y+1}`,
                    `x = ${x-1},y = ${y-1}`,
                    `x = ${x+1},y = ${y-1}`,
                    `x = ${x-1},y = ${y+1}`
                ];
                child.classList.add('empty_cell');
            }
            child.id = `x = ${x},y = ${y}`;
            child.style.width = `${BoxSize}px`;
            child.style.height = `${BoxSize}px`;
            child.style.position = 'absolute';
            child.style.border = '1px solid black';
            child.style.left = `${x * BoxSize}px`;  // Horizontal position
            child.style.top = `${y * BoxSize}px`;   // Vertical position
            
            fragment.appendChild(child);
        }
    }

    
    grid_div.appendChild(fragment);
    
}

function handle_walls(){

    // for adding walls (we need to check first if the mouse event has already been triggerd)
    // mouse
    let mouse_active = false;
    let mouse_active_remove = false;
    if(mouse_active === false){
        document.addEventListener('mousedown',(event)=>{
            mouse_active = true;
            if (event.target.classList.contains('empty_cell')){
                event.target.classList.add('wall_cell');
                event.target.classList.remove('empty_cell');
                mouse_active_remove = false;
            }else if(event.target.classList.contains('wall_cell')){
                event.target.classList.remove('wall_cell');
                event.target.classList.add('empty_cell');
                mouse_active_remove = true;
            }
        })
        document.addEventListener('mouseup',()=>{
            mouse_active = false;
            mouse_active_remove = false;
        })
    }
    document.addEventListener('mouseover',(event)=>{
        if(mouse_active && event.target.classList.contains('empty_cell') && !mouse_active_remove) {
            event.target.classList.add('wall_cell');
            event.target.classList.remove('empty_cell');
        }else if(mouse_active_remove && event.target.classList.contains('wall_cell')){
            event.target.classList.add('empty_cell');
            event.target.classList.remove('wall_cell');
        }
    })


}


function start_algorithm(){
    function calculate_distance(x, y) {
        return Math.sqrt((x-Rand_end_x)**2 + (y-Rand_end_y)**2);
    }
    function travel_to_right_move(distances, right_move, collision = 0) {
        if (collision >= 8) {
            alert('No path was found!');
            distance = 0;
            return;
        }
    
        const moves = [
            { direction: 'Right', deltaX: 1, deltaY: 0, distance: distances.right },
            { direction: 'Bottom', deltaX: 0, deltaY: 1, distance: distances.bottom },
            { direction: 'Left', deltaX: -1, deltaY: 0, distance: distances.left },
            { direction: 'Top', deltaX: 0, deltaY: -1, distance: distances.top },
            { direction: 'Top-Right', deltaX: 1, deltaY: -1, distance: distances.topright },
            { direction: 'Bottom-Left', deltaX: -1, deltaY: 1, distance: distances.bottomleft },
            { direction: 'Top-Left', deltaX: -1, deltaY: -1, distance: distances.topleft },
            { direction: 'Bottom-Right', deltaX: 1, deltaY: 1, distance: distances.bottomright },
        ];
    
        for (let move of moves) {
            if (move.distance === right_move[collision]) {
                let newX = head_grid_x + move.deltaX;
                let newY = head_grid_y + move.deltaY;
                let temp = document.getElementById(`x = ${newX},y = ${newY}`);
    
                if (temp && (temp.classList.contains('wall_cell') || temp.classList.contains('route_cell'))) {
                    collision++;
                    continue;
                }
    
                head_grid_x = newX;
                head_grid_y = newY;
                return;
            }
        }
    

        travel_to_right_move(distances, right_move, collision);
    }
    
    function handle_routes() {
        // Movement logic
        let collision = 0; // initialized for smallest distance
        let distances = {
            right: calculate_distance(head_grid_x + 1, head_grid_y),
            topright : calculate_distance(head_grid_x + 1, head_grid_y - 1),
            bottom: calculate_distance(head_grid_x, head_grid_y + 1),
            bottomleft : calculate_distance(head_grid_x - 1, head_grid_y + 1),
            left: calculate_distance(head_grid_x - 1, head_grid_y),
            topleft : calculate_distance(head_grid_x - 1, head_grid_y - 1),
            top: calculate_distance(head_grid_x, head_grid_y - 1),
            bottomright : calculate_distance(head_grid_x + 1, head_grid_y + 1)
        };
        
        // Convert distances to an array and sort
        let right_move = Object.values(distances).sort((a, b) => a - b);
        
        let prev_x = head_grid_x;
        let prev_y = head_grid_y;
        travel_to_right_move(distances,right_move,collision);
        if(distance !=0){
            distance = calculate_distance(head_grid_x, head_grid_y);
        }

        // Animation for previous blocks
        next_cell = document.getElementById(`x = ${head_grid_x},y = ${head_grid_y}`);
        prev_cell = document.getElementById(`x = ${prev_x},y = ${prev_y}`);
        // Update blocks traveled
        distance_traveled++;

        if (!next_cell.classList.contains('wall_cell')) {
            const audio = new Audio('sounds/pop.mp3');
            audio.play();
            prev_cell.classList.add('route_cell');
            prev_cell.classList.remove('next_cell');
            next_cell.classList.add('next_cell');
            next_cell.classList.remove('empty_cell');
        }
        
        if (distance > 1) {
            setTimeout(handle_routes, Time_step);
        }
        else{
            document.querySelector('.shortest_dist .value').textContent = `${distance_traveled} blocks`;
        }
    }

    let head_grid_x = Rand_start_x;
    let head_grid_y = Rand_start_y;
    let distance_traveled = 0;
    let distance = calculate_distance(head_grid_x, head_grid_y);

    handle_routes();
}

function dijkstra() {
    function getCoords(node) {
        const parts = node.split(',');
        const x = parseInt(parts[0].split('=')[1].trim());
        const y = parseInt(parts[1].split('=')[1].trim());
        return [x, y];
    }

    function getDistance(node, neighbor) {
        const [x_node, y_node] = getCoords(node);
        const [x_neighbor, y_neighbor] = getCoords(neighbor);
        return Math.sqrt((y_neighbor - y_node) ** 2 + (x_neighbor - x_node) ** 2);
    }

    function draw_route(previousnode){
        while(previous[previousnode] != null){
            document.getElementById(previousnode).classList.add('next_cell');
            previousnode = previous[previousnode]
        }
    }
    let distances = {};
    let visited = new Set();
    let nodes = Object.keys(Graph);

    let previous = {};

    // Initialize distances
    for (let node of nodes) {
        distances[node] = Infinity;
        previous[node] = null;
    }
    distances[`x = ${Rand_start_x},y = ${Rand_start_y}`] = 0;

    let intervalId = setInterval(()=>{
        nodes.sort((a, b) => distances[a] - distances[b]);
        
        let closestNode = nodes.shift();
        
        
        visited.add(closestNode);

        if(!Graph[closestNode] || distances[closestNode] === Infinity){
            clearInterval(intervalId);
            alert("no path was found :(")
        }
        
        
        for (let neighbor of Graph[closestNode]) {
            if (!visited.has(neighbor)) {
                if(document.getElementById(neighbor).classList.contains('wall_cell'))
                    continue;
                let newDistance = distances[closestNode] + getDistance(closestNode,neighbor);
                
                
                if (newDistance < distances[neighbor]) {
                    distances[neighbor] = newDistance;
                    document.getElementById(neighbor).classList.add('route_cell');
                    document.getElementById(neighbor).classList.remove('empty_cell');
                    previous[neighbor] = closestNode;
                }
                if(neighbor == `x = ${Rand_end_x},y = ${Rand_end_y}`){
                    clearInterval(intervalId);
                    draw_route(previous[neighbor]);
                    document.querySelector('.shortest_dist .value').textContent = `${newDistance} blocks`;
                }
            }
        }
        
    },Time_step/20)



}


// Function to run selected algorithm
function run(selected) {
    if (selected === 'myCustom') {
        start_algorithm();
    } else if (selected === 'dijkstra') {
        dijkstra();
    } else {
        alert("Algorithm not available yet :(");
    }
};

function setCookie(name, value, days=null){
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };

  function getCookie(name) {
    const nameEQ = name + "=";
    const cookiesArray = document.cookie.split("; ");
    for (let cookie of cookiesArray) {
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length);
      }
    }
    return null;
  }
  
function handle_inputs(){
    const options = document.querySelectorAll('.option');
    const opts = document.querySelector('.options');
    const algos = document.getElementById('Algos');
    
    algos.onclick = function (event) {
        event.stopPropagation(); // it works d'ont TOUCH it
        opts.style.display = opts.style.display === 'block' ? 'none' : 'block';
    }
    
    document.addEventListener('click', function () {
        opts.style.display = 'none';
    });
    
    for (let option = 0; option < options.length; option++) {
        const element = options[option];
        element.onclick = function (){
            selected = element.id;
            setCookie("Algorithm",selected);
        }
    }
    document.getElementById('BtnStart').onclick = function() {
        selected = getCookie("Algorithm") ?? selected;
        if (selected) {
            run(selected);
        }else{
            alert("select an algorithm first !");
        }
      };
    document.getElementById('Reset').onclick = function() {
        location.reload();
    }
}

function main_loop(){
    create_grid();
    handle_walls();
    handle_inputs();
}

main_loop()