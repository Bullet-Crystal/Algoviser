// Global Variablres

const speedelement = document.getElementById('speed');
const routeselemnt = document.getElementById('routes');
const BtnStart = document.getElementById('BtnStart');
const ResetBtn = document.getElementById('Reset');

const WinWidth = window.innerWidth;
const WinHeight = window.innerHeight;
const BoxSize = WinWidth > 700 ? 30 : 20;
let Time_step = 100 - speedelement.value;//time for each frame in (ms)
let routes = routeselemnt.value;
const Graph ={};
let selected = '';
let AlgoIsRunning = false;
let Reseted = false;


const grid_width = Math.floor((WinWidth / BoxSize) -2);
const grid_height = Math.floor((WinHeight / BoxSize)/1.2);

const grid_div = document.querySelector('.grid');
let [Rand_start_x,Rand_start_y,Rand_end_x,Rand_end_y] = start_end_cell(); 

speedelement.addEventListener('input',updateSpeed)
routeselemnt.addEventListener('input',updateRoute);

function updateSpeed(){
    document.getElementById('speedValue').textContent = speedelement.value;
    Time_step = 100 - speedelement.value;
}

function updateRoute(){
    document.getElementById('routeValue').textContent = routeselemnt.value;
    routes = routeselemnt.value;
}

function start_end_cell(){
    let Rand_start_x = Math.floor(Math.random()*(grid_width - 2)) + 1;
    let Rand_start_y = Math.floor(Math.random()*(grid_height - 2)) + 1;
    let Rand_end_x = Math.floor(Math.random()*(grid_width - 2)) + 1;
    let Rand_end_y = Math.floor(Math.random()*(grid_height - 2)) + 1;
     

    return [Rand_start_x,Rand_start_y,Rand_end_x,Rand_end_y]

}



function create_grid(){
    const fragment = document.createDocumentFragment();


    for (let y = 0; y < grid_height; y++){
        for (let x = 0; x < grid_width; x++){
            let child = document.createElement('div');
            if(x == 0 || x >= grid_width - 1 || y == 0 || y >= grid_height - 1){
                child.classList.add('wall_cell');
            }else{
                if(routes === 4){
                    Graph[`x = ${x},y = ${y}`] = [
                        `x = ${x+1},y = ${y}`,
                        `x = ${x-1},y = ${y}`,
                        `x = ${x},y = ${y+1}`,
                        `x = ${x},y = ${y-1}`,
                    ];
                }else{
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
                }
                if(x == Rand_end_x && y == Rand_end_y){
                child.classList.add('end_cell');
                child.style.backgroundImage = "url('./icons/end.png')";
                child.style.backgroundRepeat = 'no-repeat';
                child.style.backgroundSize = '100% 100%';
            }else if(x == Rand_start_x && y == Rand_start_y){
                child.classList.add('start_cell');
                child.classList.remove('route_cell');
                child.style.backgroundImage = "url('./icons/start.png')";
                child.style.backgroundRepeat = 'no-repeat';
                child.style.backgroundSize = '100% 100%';
            }
            else{
                if(!Reseted){
                    child.classList.add('empty_cell');
                }else{
                    if(!document.getElementById(`x = ${x},y = ${y}`).classList.contains('wall_cell'))
                        child.classList.add('empty_cell');
                    else
                        child.classList.add('wall_cell');
                    
                }
            }
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

    grid_div.innerHTML = '';
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
        if(mouse_active && event.target.classList.contains('empty_cell') && !mouse_active_remove){
            event.target.classList.add('wall_cell');
            event.target.classList.remove('empty_cell');
        }else if(mouse_active_remove && event.target.classList.contains('wall_cell')){
            event.target.classList.add('empty_cell');
            event.target.classList.remove('wall_cell');
        }
    })


}

function Cus() {
    function getCoords(node) {
        const [xPart, yPart] = node.split(',');
        return [
            parseInt(xPart.split('=')[1].trim()), 
            parseInt(yPart.split('=')[1].trim())
        ];
    }

    function calculate_distance(x, y) {
        return Math.sqrt((x - Rand_end_x) ** 2 + (y - Rand_end_y) ** 2);
    }
    function draw_route(previousNode) {
        if (previous[previousNode] != null || previous[previous[previousNode]] != previousNode) {
            document.getElementById(previousNode).classList.add('next_cell');
            document.getElementById(previousNode).classList.remove('route_cell');
            document.getElementById(previousNode).classList.remove('dj_cell');
            previousNode = previous[previousNode];
            distance_traveled++;
            setTimeout(() => draw_route(previousNode), Time_step);
        } else {
            document.querySelector('.shortest_dist .value').textContent = `${distance_traveled} blocks`;
            AlgoIsRunning = false;
            StatusOf(BtnStart);
            StatusOf(ResetBtn);
        }
    }

    function execute_Custom() {
        if (stack.length === 0) {
            AlgoIsRunning = false;
            return;
        }

        let node = stack.pop();

        while (visited.has(node) && stack.length > 0) {
            node = stack.pop();
        }

        if (!node || visited.has(node)) {
            setTimeout(execute_Custom, Time_step);
            return;
        }

        if (document.getElementById(node).classList.contains("end_cell")) {
            draw_route(node);
            return;
        }

        visited.add(node);
        let cell = document.getElementById(node);
        cell.classList.add('route_cell');
        cell.classList.remove('empty_cell');

        let [head_grid_x, head_grid_y] = getCoords(node);

        let directions = [
            { name: "right", dx: 1, dy: 0 },
            { name: "topright", dx: 1, dy: -1 },
            { name: "bottom", dx: 0, dy: 1 },
            { name: "bottomleft", dx: -1, dy: 1 },
            { name: "left", dx: -1, dy: 0 },
            { name: "topleft", dx: -1, dy: -1 },
            { name: "top", dx: 0, dy: -1 },
            { name: "bottomright", dx: 1, dy: 1 }
        ];

        let possibilities = directions.map(({ name, dx, dy }) => ({
            key: name,
            neighbor: `x = ${head_grid_x + dx},y = ${head_grid_y + dy}`,
            distance: calculate_distance(head_grid_x + dx, head_grid_y + dy)
        }));

        let sortedMoves = possibilities
            .filter(({ neighbor }) => {
                let neighborCell = document.getElementById(neighbor);
                return neighborCell && !visited.has(neighbor) && !neighborCell.classList.contains('wall_cell');
            })
            .sort((a, b) => a.distance - b.distance)
            .reverse();

        if (sortedMoves.length > 0) {
            for (let { neighbor } of sortedMoves) {
                stack.push(neighbor);
                previous[neighbor] = node;
            }

            new Audio('sounds/pop.mp3').play();
            cell.classList.add('dj_cell');
            cell.classList.remove('route_cell');
        }


        setTimeout(execute_Custom, Time_step);
    }

    let visited = new Set();
    let stack = [`x = ${Rand_start_x},y = ${Rand_start_y}`];
    let distance_traveled = 0;
    let previous = {};

    execute_Custom();
}




function generateMaze() {
    let visited = new Set();
    let stack = [];
    
    [RsX, RsY, ReX, ReY] = start_end_cell(); // Get start and end positions
    let startNode = `x = ${RsX},y = ${RsY}`;
    
    stack.push(startNode);
    visited.add(startNode);

    function getNeighbors(x, y) {
        let directions = [
            [0, -2], [0, 2], [-2, 0], [2, 0] // Move in 2-cell increments
        ];
        directions.sort(() => Math.random() - 0.5); // Shuffle directions
        let neighbors = [];

        for (let [dx, dy] of directions) {
            let nx = x + dx, ny = y + dy;
            let key = `x = ${nx},y = ${ny}`;
            if (nx > 0 && nx < grid_width - 1 && ny > 0 && ny < grid_height - 1 && !visited.has(key)) {
                neighbors.push([nx, ny]);
            }
        }
        return neighbors;
    }

    function removeWall(x, y, nx, ny) {
        let wallX = (x + nx) / 2;
        let wallY = (y + ny) / 2;
        let wallKey = `x = ${wallX},y = ${wallY}`;
        document.getElementById(wallKey).classList.remove('wall_cell');
        document.getElementById(wallKey).classList.add('empty_cell');
    }

    function executeMaze() {
        if (stack.length > 0) {
            let node = stack.pop();
            let [x, y] = node.match(/\d+/g).map(Number);
            let neighbors = getNeighbors(x, y);

            if (neighbors.length > 0) {
                stack.push(node); // Push current node back to stack
                
                let [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
                let nextNode = `x = ${nx},y = ${ny}`;
                
                removeWall(x, y, nx, ny); // Remove wall between current and next cell
                
                document.getElementById(nextNode).classList.remove('wall_cell');
                document.getElementById(nextNode).classList.add('empty_cell');
                
                visited.add(nextNode);
                stack.push(nextNode);
            }

            setTimeout(executeMaze, Time_step);
        } else {
            // Maze generation completed
            AlgoIsRunning = false;
            StatusOf(BtnStart);
            StatusOf(ResetBtn);
        }
    }

    // Fill grid with walls
    for (let y = 1; y < grid_height - 1; y++) {
        for (let x = 1; x < grid_width - 1; x++) {

            let cell = document.getElementById(`x = ${x},y = ${y}`);
            if(cell.classList.contains('end_cell') || cell.classList.contains('end_cell'))
                continue;
            cell.classList.add('wall_cell');
            cell.classList.remove('empty_cell');

        }
    }

    executeMaze();
}


function dfsIterative() {
    function draw_route(previousNode) {
        if (previous[previousNode] != null || previous[previous[previousNode]] != previousNode) {
            document.getElementById(previousNode).classList.add('next_cell');
            document.getElementById(previousNode).classList.remove('route_cell');
            document.getElementById(previousNode).classList.remove('dj_cell');
            previousNode = previous[previousNode];
            newDistance++;
            setTimeout(() => draw_route(previousNode), Time_step);
        } else {
            AlgoIsRunning = false;
            document.querySelector('.shortest_dist .value').textContent = `${parseFloat(newDistance).toFixed(2)} blocks`;
            StatusOf(BtnStart);
            StatusOf(ResetBtn);
        }
    }

    function execute_dfsIt() {
        if (stack.length > 0) {
            let node = stack.pop();
            while(visited.has(node)){
                node = stack.pop();
            }
            
            if (node === `x = ${Rand_end_x},y = ${Rand_end_y}`) {
                ended = true;
                draw_route(node);
                return;
            }

            if (!visited.has(node)) {
                visited.add(node);
                document.getElementById(node).classList.add('dj_cell');
                document.getElementById(node).classList.remove('empty_cell');

                for (let i = Graph[node].length -1; i >= 0; --i) {
                    let neighbor = Graph[node][i];

                    if (!neighbor || visited.has(neighbor) || document.getElementById(neighbor).classList.contains('wall_cell')) 
                        continue;

                    if (!visited.has(neighbor)) {
                        previous[neighbor] = node;
                        document.getElementById(neighbor).classList.add('route_cell');
                        document.getElementById(neighbor).classList.remove('dj_cell');
                        stack.push(neighbor);
                    }
                }
            }
            setTimeout(execute_dfsIt, Time_step);
        }
    }


    let newDistance = 0;
    let previous = {};
    let visited = new Set();
    let stack = [`x = ${Rand_start_x},y = ${Rand_start_y}`];
    
    execute_dfsIt();
}


function dijkstra(){
    function getCoords(node){
        const parts = node.split(',');
        const x = parseInt(parts[0].split('=')[1].trim());
        const y = parseInt(parts[1].split('=')[1].trim());
        return [x, y];
    }

    function getDistance(node, neighbor){
        const [x_node, y_node] = getCoords(node);
        const [x_neighbor, y_neighbor] = getCoords(neighbor);
        return Math.sqrt((y_neighbor - y_node) ** 2 + (x_neighbor - x_node) ** 2);
    }

    function draw_route(previousnode){
        if(previous[previousnode] != null){
            document.getElementById(previousnode).classList.add('next_cell');
            document.getElementById(previousnode).classList.remove('route_cell');
            document.getElementById(previousnode).classList.remove('dj_cell');
            previousnode = previous[previousnode]
            setTimeout(()=>{draw_route(previousnode)},Time_step);
        }else{
            AlgoIsRunning = false;
            StatusOf(BtnStart);
            StatusOf(ResetBtn);
        }
    }

    function execute_dj(){
        nodes.sort((a, b) => distances[a] - distances[b]);
        let closestNode = nodes.shift();
        visited.add(closestNode);

        if(!Graph[closestNode] || distances[closestNode] === Infinity){
            AlgoIsRunning = false;
            alert("no path was found :(")
            return;
        }
        let i = 0;
        for (let neighbor of Graph[closestNode]){
            if(i >= routes)
                break;
            i += 1;
            if (!visited.has(neighbor)){
                if(document.getElementById(neighbor).classList.contains('wall_cell'))
                    continue;

                let newDistance = distances[closestNode] + getDistance(closestNode,neighbor);
                document.getElementById(neighbor).classList.add('dj_cell');
                document.getElementById(neighbor).classList.remove('empty_cell');
                
                if (newDistance < distances[neighbor]){
                    distances[neighbor] = newDistance;
                    previous[neighbor] = closestNode;
                }
                if(neighbor == `x = ${Rand_end_x},y = ${Rand_end_y}`){
                    document.querySelector('.shortest_dist .value').textContent = `${parseFloat(newDistance).toFixed(2)} blocks`;
                    draw_route(previous[neighbor]);
                    return;
                }
            }else{
                document.getElementById(neighbor).classList.add('route_cell');
                document.getElementById(neighbor).classList.remove('dj_cell');
            }
        }

        setTimeout(execute_dj,Time_step);
    }

    let distances ={};
    let visited = new Set();
    let nodes = Object.keys(Graph);
    let previous ={};

    // Initialize distances
    for (let node of nodes){
        distances[node] = Infinity;
        previous[node] = null;
    }
    distances[`x = ${Rand_start_x},y = ${Rand_start_y}`] = 0;
    execute_dj();

}


// Function to run selected algorithm
function run(selected){
    AlgoIsRunning = true;
    if (selected === 'myCustom'){
        Cus();
    } else if (selected === 'dijkstra'){
        dijkstra();
    } else if (selected === 'Maze'){
        generateMaze();
    } else if (selected === 'dfsI'){
        dfsIterative();
    } else{
        AlgoIsRunning = false;
        alert("Algorithm not available yet :(");
    }
    StatusOf(BtnStart);
    StatusOf(ResetBtn);
};

function setCookie(name, value, days=null){
    let expires = "";
    if (days){
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };

  function getCookie(name){
    const nameEQ = name + "=";
    const cookiesArray = document.cookie.split("; ");
    for (let cookie of cookiesArray){
      if (cookie.indexOf(nameEQ) === 0){
        return cookie.substring(nameEQ.length);
      }
    }
    return null;
  }
  
function StatusOf(btn){
      if(AlgoIsRunning){
          btn.style.cursor = 'not-allowed';
          btn.disabled = true;
      }else{
          btn.style.cursor = 'pointer';
          btn.disabled = false;
      }
  }
function handle_inputs(){


    const options = document.querySelectorAll('.option');
    const opts = document.querySelector('.options');
    const algos = document.getElementById('Algos');
    
    algos.onclick = function (event){
        event.stopPropagation(); // it works d'ont TOUCH it
        opts.style.display = opts.style.display === 'block' ? 'none' : 'block';
    }
    
    document.addEventListener('click', function (){
        opts.style.display = 'none';
    });
    
    for (let option = 0; option < options.length; option++){
        const element = options[option];
        element.onclick = function (){
            selected = element.id;
            setCookie("Algorithm",selected);
        }
    }

    BtnStart.onclick = function(){
        selected = getCookie("Algorithm") ?? selected;
        if (selected){
            if(!AlgoIsRunning){
                run(selected);
            }
        }else{
            alert("select an algorithm first !");
        }
      };
    ResetBtn.onclick = function(){
        if(!AlgoIsRunning){
            Reseted = true;
            create_grid();
            // main_loop();
        }
    }
    document.getElementById('Wipe All').onclick = function(){
        location.reload();
    }
    document.querySelector('#Settings').onclick = function(event){
        if(event.target == this){

            const paramsElement = document.querySelector('.params');
            paramsElement.style.display = paramsElement.style.display === 'block' ? 'none' : 'block';
        }
    }
    // Prevent mobile users from copying li tags
    document.querySelectorAll('li').forEach(item =>{
        item.addEventListener('contextmenu', (e) =>{
          e.preventDefault();
        });
      });
      
}

function main_loop(){
    create_grid();
    handle_walls();
    handle_inputs();
}

main_loop();