import {scene,latestObj,createText,texter} from "/main.js";

function textChange(elem){
    /////remove and add text again (update text)
    console.log(elem.target.value);
    console.log(latestObj);
    //remove text
    while (latestObj.object.children.length)
    {
        scene.getObjectByName(latestObj.object.name).remove(latestObj.object.children[0]);
    }
    scene.remove(scene.getObjectByName(latestObj.object.name));

    //add text
    texter[latestObj.object.name.split("text")[1]].text = elem.target.value;
    createText(latestObj.object.name.split("text")[1]);
    console.log(scene);
}

document.getElementById("text").addEventListener("change", textChange);