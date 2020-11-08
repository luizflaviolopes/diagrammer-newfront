export const bindMouseFunctions = (element,functions) => {
    
    
    let lastMove

    const isMoved = (evt) => {
        const nonMoveRange = 2
        if(lastMove && (Math.abs(evt.x-lastMove.x) > nonMoveRange || Math.abs(evt.y-lastMove.y)> nonMoveRange))
            return true;
        else
            return false;
    }



    const downListener = (evt) => {
        lastMove = {x: evt.x, y: evt.y };
        element.addEventListener('mousemove', moveListener)
        functions.onDown && functions.onDown(evt);
    }
    const moveListener = (evt) => {
        functions.onDrag && functions.onDrag(evt);
    }
    const upListener = (evt) => {
        element.removeEventListener('mousemove', moveListener)
        if (isMoved(evt)) {
            functions.onDrop && functions.onDrop(evt);
        } else if (evt.detail === 2) {
            functions.onDbClick && functions.onDbClick(evt);
        } else
        {
            functions.onClick && functions.onClick(evt);
        }
    }

    element.addEventListener('mousedown', downListener)
    
    element.addEventListener('mouseup', upListener)
    
}



