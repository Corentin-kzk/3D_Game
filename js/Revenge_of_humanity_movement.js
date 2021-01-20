import { star_ship, wait_menu } from "./Revenge_of_humanity.js"
export const move_right = () => {
    star_ship.rotation.z += 0.05;
    if (star_ship.position.x > Math.ceil(window.innerWidth / 4) * -1)
        star_ship.position.x -= 10;
}

export const move_left = () => {
    star_ship.rotation.z -= 0.05;
    if (star_ship.position.x < Math.ceil(window.innerWidth / 4))
        star_ship.position.x += 10;
}

export const move_forward = () => {
    star_ship.rotation.x -= 0.0001;
    star_ship.position.y += 3;
}

export const move_backward = () => {
    star_ship.rotation.x += 0.0001;
    star_ship.position.y -= 3;

}


export let left = false,
    right = false,
    forward = false,
    backward = false;

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
    switch (e.keyCode) {
        case 37:
            left = true;
            //-Move left
            break;
        case 39:
            right = true;
            //-Move right
            break;
        case 38:
            forward = true;
            //-Move up
            break;
        case 40:
            backward = true;
            //-Move down
            break;
        case 27:
            wait_menu();
            break;
    }
};

document.addEventListener("keyup", keyUpHandler, false);

function keyUpHandler(e) {
    switch (e.keyCode) {
        case 37:
            left = false;
            //-Move left
            break;
        case 39:
            right = false;
            //-Move right
            break;
        case 38:
            forward = false;
            //-Move up
            break;
        case 40:
            backward = false;
            //-Move down
            break;
    }
};