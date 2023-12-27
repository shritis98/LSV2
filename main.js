const inputPage=document.querySelector("#input-page");
const btnSubmit=document.querySelector("#btn-submit");
const layout=document.querySelector("#layout");

const noOfFloors= parseInt(document.querySelector("#no-of-floors").value);
const noOfLifts=parseInt(document.querySelector("#no-of-lifts").value);

//to check input
const checkInput = ()=>{
    const noOfFloors= document.querySelector("#no-of-floors").value;
    const noOfLifts=document.querySelector("#no-of-lifts").value;
    
    if(noOfFloors<=10 && noOfFloors>=1 && noOfLifts<=10 && noOfLifts>=1){
        inputPage.style.display = "none";
        reset()
        buildLayout(noOfFloors)
        buildLift(noOfLifts)
    }else if(noOfFloors>10 && noOfLifts>10){
        alert("Maximum number of floors and lifts can be 10");
    }else if(noOfFloors<=0 || noOfLifts<=0){
        alert("Number of floors or lifts cannot be 0 or negative");
    }else if(noOfFloors>10){
        alert("Maximum number of floors can be 10");
    }else if(noOfLifts>10){
        alert("Maximum number of lifts can be 10");
    }
}

btnSubmit.addEventListener("click", checkInput);


//to build layout
const buildLayout = (noOfFloors)=>{

    // console.log(noOfFloors);
    let floorLayout=document.createElement('div');
    floorLayout.setAttribute("class", "floorlay");
    layout.append(floorLayout);

    for(let i=noOfFloors-1;i>=0;i--){
        // console.log(i);

        let floorContainer=document.createElement('div');
            floorContainer.setAttribute("class","floor");
            floorContainer.setAttribute("id","floorCont"+i);

        let btnContainer = document.createElement('div');
            btnContainer.setAttribute("class", "btnCont");
            btnContainer.setAttribute("id", "btnCont"+i);
        
        let upBtn=document.createElement("button");
            upBtn.setAttribute("class","btn");
            // upBtn.setAttribute("id","upBtn"+i);
            upBtn.setAttribute("data-buttonFloor",i);
            // upBtn.setAttribute("data-direction","Up");
            upBtn.innerText="Up";
        let downBtn=document.createElement("button");
            downBtn.setAttribute("class","btn");
            // downBtn.setAttribute("id","downBtn"+i);
            downBtn.setAttribute("data-buttonFloor",i);
            // downBtn.setAttribute("data-direction","Down");
            downBtn.innerText="Down";
            
        let floorNumber=document.createElement("p");
            floorNumber.innerText="Floor "+i;
        if(i==noOfFloors-1){
            btnContainer.append(downBtn, floorNumber);
        }else if(i==0){
            btnContainer.append(upBtn, floorNumber);
        }else{
            btnContainer.append(upBtn, downBtn, floorNumber);
        }
        floorContainer.append(btnContainer);
        floorLayout.append(floorContainer);
    }
    buttonClick();

}

//to build lift
const buildLift = (noOfLifts)=>{
    // console.log(noOfLifts);
    let liftLayout=document.createElement('div')
    liftLayout.setAttribute("class", "liftLay")
    for(let i=0;i<noOfLifts;i++){
        // console.log(i);
        let liftContainer=document.createElement('div');
            liftContainer.setAttribute("class", "lift");
            liftContainer.setAttribute("data-liftFloor", 0);
            liftContainer.setAttribute("data-liftAvailable", "available");
        let leftGate = document.createElement("div");
            leftGate.setAttribute("class", "lGate");
        let rightGate = document.createElement("div");
            rightGate.setAttribute("class", "rGate");

            liftContainer.append(leftGate, rightGate);
            liftLayout.append(liftContainer);
    } 
    floorCont0.append(liftLayout);

}

//to listen to buttons clicked
function buttonClick(){
    let button = document.querySelectorAll(".btn");
    let buttonsClicked = [];
    button.forEach((butn)=>{
        butn.addEventListener("click",()=>{
            const floorNo = butn.getAttribute("data-buttonFloor");
            console.log( "This is recent click floorNo "+floorNo);
            let totalBtnsClkd = buttonsClicked.push(floorNo);
            // console.log("total number of buttons clicked are "+totalBtnsClkd);
            console.log("All the buttons clicked are "+buttonsClicked);
            AvailableLift(buttonsClicked, floorNo);
        })
        
    })
    
}

//checks available lift, which is also closest and calculates the time and distance
function AvailableLift(buttonsClicked, floorNo){
    const liftObj = document.querySelectorAll(".lift");
    let liftArray = Array.from(liftObj);
    
    // console.log(liftArray);

    
    let closest;
    let minDistance = Infinity;
  
    for(let i=0; i<liftArray.length;i++){

        if(liftArray[i].getAttribute("data-liftAvailable") == "available"){
            let liftCalled = liftArray[i].getAttribute("data-liftFloor")
            floorNo = buttonsClicked[0];
            let difference = Math.abs(floorNo-liftCalled)
            if(minDistance > difference){
                closest = i;
            
                minDistance = difference;
            }
        }else if(allLiftBusy(liftArray)){
            console.log("all lifts are busy");
        }else if(liftPresent(buttonsClicked, liftArray) ){
            console.log("lift is present");
            closest = i;
            buttonsClicked.pop();
            return floorNo;
        }
        
        // console.log(liftArray[i])
    }

    console.log(floorNo+typeof(floorNo))
    console.log("the closest lift is"+ closest)
    let floorCalled = liftArray[closest].getAttribute("data-liftFloor");
    let distance = (-6.3)*(Number(floorNo))
    let diffInFloors = Math.abs(2*(Number(floorNo)-floorCalled));
    let currentFloor = Number(floorNo);
    buttonsClicked.shift();
    // console.log(buttonsClicked);
    moveLift(liftArray, closest, distance, diffInFloors, currentFloor, buttonsClicked)

}

//to return true when all lifts are busy
function allLiftBusy(liftArray){
    for(let i=0;i<liftArray.length;i++){
        if(liftArray[i].getAttribute("data-liftAvailable") == "available"){
            return false;
        }
    }

    return true;
}

//to check if lift is already present at a floor even if busy
function liftPresent(buttonsClicked, liftArray){
    for(let i=0; i<liftArray.length; i++){
        let liftAtPresent = liftArray[i].getAttribute("data-liftFloor");
        if(buttonsClicked.includes(liftAtPresent) && liftArray[i].getAttribute("data-liftAvailable") == "busy"){
           
            return true;
        }
    }
    return false;
}

//for the movement of lifts and animation of doors
function moveLift(liftArray, closest, distance, diffInFloors, currentFloor, buttonsClicked){
    // console.log(liftArray);
    // console.log(closest);
    // console.log(distance);
    // console.log(buttonsClicked);
    console.log("this is the time required "+diffInFloors);
    
    setTimeout(()=>{
        liftArray[closest].setAttribute("data-liftAvailable", "busy");
        liftArray[closest].style.transform = `translateY(${distance}rem)`;
        liftArray[closest].style.transition = `transform ${diffInFloors}s`;
        liftArray[closest].setAttribute("data-liftFloor", currentFloor);
        
    }, 0)

    setTimeout(()=>{
        liftArray[closest].children[0].style.transform = `translateX(${-100}%)`;
        liftArray[closest].children[0].style.transition = `transform ${2.5}s`;
        liftArray[closest].children[1].style.transform = `translateX(${100}%)`;
        liftArray[closest].children[1].style.transition = `transform ${2.5}s`;
    },(diffInFloors*1000))

    setTimeout(()=>{
        liftArray[closest].children[0].style.transform = `translateX(${0}%)`;
        liftArray[closest].children[0].style.transition = `transform ${2.5}s`;
        liftArray[closest].children[1].style.transform = `translateX(${-0}%)`;
        liftArray[closest].children[1].style.transition = `transform ${2.5}s`;
    },((diffInFloors*1000)+2500))

    setTimeout(()=>{
        liftArray[closest].setAttribute("data-liftAvailable", "available");
        //process queue when all lifts are busy
        if (buttonsClicked.length !== 0){
            floorNo = buttonsClicked[0];
            AvailableLift(buttonsClicked, floorNo);
        }
    }, ((diffInFloors*1000)+5000))
    // liftArray[AvlblLiftNo].setAttribute("data-liftAvailable", "available");
    
}

//to show input page when reset button is clicked
const reset=()=>{
    let resetBtn = document.createElement("button");
    resetBtn.setAttribute("class", "resetbutton");
    resetBtn.innerText="Restart";
    layout.append(resetBtn);

    resetBtn.addEventListener("click", ()=>{
        console.log('reset');
        let hideFloor=document.querySelector(".floorlay");
        layout.removeChild(hideFloor);
        layout.removeChild(resetBtn);
        console.log(layout);
        document.querySelector("#no-of-floors").value = "";
        document.querySelector("#no-of-lifts").value = "";
        inputPage.style.display = "block";
    });
}

// const consolelift = ()=>{
//     const liftObj = document.querySelectorAll(".lift");
//     let liftArray = Array.from(liftObj);
//     console.log(liftArray);
// }

// const moveLift = ()=>{
//     const liftObj = document.querySelectorAll(".lift");
//     let liftArray = Array.from(liftObj);
//     // console.log(liftArray);

//     let buttonsClicked = [0];
//     let buttons = document.querySelectorAll(".btn");
//     buttons.forEach((butn)=>{
//         butn.addEventListener("click",()=>{

//             const floorNo = butn.getAttribute("data-buttonFloor");
//             let totalBtnsClkd = buttonsClicked.push(floorNo);
//             console.log(totalBtnsClkd);
//             console.log("The buttons clicked are "+buttonsClicked);

//             let distance = (-6.3)*(Number(floorNo))
//             let diffInFloors = Math.abs(2*(buttonsClicked[0]-buttonsClicked[1]));

//             setTimeout(()=>{

//             liftArray[0].setAttribute("data-liftAvailable", "busy");
//             // let distance = (-6.3)*(Number(floorNo))
//             liftArray[0].style.transform = `translateY(${distance}rem)`;

//             // let diffInFloors = Math.abs(2*(buttonsClicked[0]-buttonsClicked[1]));
//             console.log(diffInFloors);
//             liftArray[0].style.transition = `transform ${diffInFloors}s`;
//             }, 0)
//             let floorReached = buttonsClicked.shift();
//             console.log("Previous floor: "+floorReached, " List of floors: "+buttonsClicked);
//         })
//     })
    
// }




