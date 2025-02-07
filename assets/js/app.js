let cl = console.log;

const userData = document.getElementById("userData");
const title = document.getElementById("title");
const body = document.getElementById("body");
const userId = document.getElementById("userId");
const sBtn = document.getElementById("sBtn");
const uBtn = document.getElementById("uBtn");
const dataContainer = document.getElementById("dataContainer");
const loader = document.getElementById("loader");

const Base_URL = `https://practice-set-e97cf-default-rtdb.firebaseio.com/`;
const Post_Url =  `${Base_URL}/posts.json`;


const snackBar = (title, iconHtml, bgColor = "#439643", color = "#fff") => {
  Swal.fire({
    title: `<div style="display: flex; align-items: center; justify-content:center; gap: 8px;">${iconHtml} ${title}</div>`,
    timer: 1500,
    width: "300px",
    padding: "0.5rem",
    showConfirmButton: false,
    toast: true,
    position: "top",
    color,
    customClass: {
      popup: "custom-snackbar",
    },
    didOpen: () => {
      document.querySelector(".custom-snackbar").style.backgroundColor =
        bgColor;
    },
  });
};



// Loder Function
const circleLoder = (ele,circle)=>{
   circle ? ele.classList.remove('d-none') : ele.classList.add('d-none');
  }
   


const makeApicall = (methodName , apiUrl , body = null)=>{
   return new Promise((resolve,reject)=>{
     circleLoder(loader , true)
     let xhr = new XMLHttpRequest()
     xhr.open(methodName , apiUrl)
     xhr.onload = function()
     {
       circleLoder(loader, false)
       if(xhr.status>=200 && xhr.status<=299)
       {
          let data = JSON.parse(xhr.response)
           resolve(data); 
       }

       else
       {
          reject(xhr.statusText)
          snackBar("Something went wrong", "❌", "#d33");
          
       }
     }

     xhr.send(body ? JSON.stringify(body) : null)
   
      xhr.onerror = function()
      {

        circleLoder(loader, false) 
         reject(`Network Error`)
         snackBar("Something went wrong", "❌", "#d33");
         
      }

   })
}



const fechAllDataFromDB = async()=>{
   try
   {
        let res = await makeApicall('GET', Post_Url , null);
        let obj = objToarr(res)
        temp(obj)
   }  

   catch{
    snackBar("Something went wrong", "❌", "#d33");
  }
  //  catch(err){
  //    snackBar(err , 'error')
  // }
}
     
fechAllDataFromDB();


// object to arr converting function
const objToarr = (obj=>{
  return Object.keys(obj).map(key=>({...obj[key], id: key}))
})





   
  const temp = (arr=>{
    let result = '';

    arr.forEach(add=>{
      result+=`
      
        <div class="card" id="${add.id}">
                  <div class="card-header">
                    <h5>${add.title}</h5>
                  </div>
                   <div class="card-body">
                    <p>${add.body}</p>
                   </div>
                    <div class="card-footer d-flex justify-content-between">
                      <button class="btn btn-primary" onclick ="onEdit(this)">Edit</button>
                      <button class="btn btn-danger" onclick ="onDelete(this)">Delete</button>
                    </div>
                </div>
      
      `
      dataContainer.innerHTML = result; 
    })
  })


  const createCard = (obj , res)=>{
    let card = document.createElement('div')
    card.className = 'card id="${card.id}"';
    card.id = res.name;
    card.innerHTML = `
    
                   <div class="card-header">
                    <h5>${obj.title}</h5>
                   </div>
                   <div class="card-body">
                    <p>${obj.body}</p>
                   </div>
                    <div class="card-footer d-flex justify-content-between">
                      <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                      <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                    </div>
    
    `
       dataContainer.appendChild(card)
  }

  // to show / hide Submit and Upadte button

    const subTupBtn = ((ele,show)=>{
      show ? ele.classList.remove('d-none')  : ele.classList.add('d-none')
    })

 
const sendObjToDB = async (eve)=>{
  eve.preventDefault();

  let newObj = 
  {
     title:title.value,
     body:body.value,
     userId:userId.value,
    }
     userData.reset();
    snackBar("Added Successfully", "✅", "#28a745");
    
    try
    {
    let data = await makeApicall('POST',Post_Url , newObj)
    createCard(newObj , data)
    userData.reset();
    }

    catch
    {
      snackBar("Something went wrong", "❌", "#d33");
    }
}



const onEdit = async(ele)=>{
 let getEdit_ID = ele.closest('.card').id;
 localStorage.setItem('editId',getEdit_ID);
 let getEdit_Url = `${Base_URL}/posts/${getEdit_ID}.json`;

 try
 {
  let data = await makeApicall('GET', getEdit_Url , null);
  title.value = data.title;
  body.value = data.body;
  userId.value = data.userId;
  subTupBtn(sBtn, false)
  subTupBtn(uBtn, true)
 }

 catch(err)
 {
    cl(err ,'err')
 }
 
}

 

const onUpdate = async ()=>{
  let getUpdateObj = 
  {
    title:title.value,
    body:body.value,
    userId:userId.value,
    
  }
  cl(getUpdateObj)
  userData.reset()
  snackBar("Updated Successfully", "✏️", "#e9376c");

  subTupBtn(sBtn, true)
  subTupBtn(uBtn, false)
 
   let getUpdate_ID = localStorage.getItem('editId');
   cl(getUpdate_ID)
   let getUpdate_Url = `${Base_URL}/posts/${getUpdate_ID}.json`;
   cl(getUpdate_Url)
   try
   {
    let data = await makeApicall('PATCH', getUpdate_Url , getUpdateObj);
    let data01 = document.getElementById(getUpdate_ID).children
    data01[0].innerHTML =`<h5> ${data.title}</h5>`;  
    data01[1].innerHTML =`<p> ${data.body}</p>`;  
   }
   catch(err)
   {
     cl(err , 'err')
   }
}



const onDelete = async (ele)=>{
  let getDel_ID = ele.closest('.card').id;
  cl(getDel_ID);

  let del_url = `${Base_URL}/posts/${getDel_ID}.json`;
  cl(del_url)
 
  try{
    let data = await makeApicall('DELETE', del_url , null);
    data = ele.closest('.card').remove()
    snackBar("Deleted Successfully!", "🗑️",);
    // data = document.getElementById(getDel_ID);
    // data.remove()
    
  }
  catch(err)
  {
     cl(err , 'err')
  }
}

userData.addEventListener('submit',sendObjToDB)
uBtn.addEventListener('click',onUpdate)


