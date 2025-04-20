// basic firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD87LTezX95NqR2MRslR4OXFwhbZe5tV6Y",
    authDomain: "first-db-577a2.firebaseapp.com",
    databaseURL: "https://first-db-577a2-default-rtdb.firebaseio.com",
    projectId: "first-db-577a2",
    storageBucket: "first-db-577a2.firebasestorage.app",
    messagingSenderId: "302212187159",
    appId: "1:302212187159:web:0d7e6e93176dbab352c852",
    measurementId: "G-5HSF34K7SY"
  };

  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
 
  let students=[];
  const loader=document.querySelector('.loader');
 
 

 

  //updating data
  const updateData=(key)=>{
    console.log("Update data function working",key);

            // store key in localstorage
            localStorage.setItem('update_key',key);
            console.log("Key= ",key);
            
            db.ref('Students').orderByKey ().equalTo(key).once('value').then((snapshot)=>{
                   let fetchedData=""
                    if(snapshot.exists()){
                        snapshot.forEach((childSnapshot)=>{
                             fetchedData=childSnapshot.val();
                             console.log(fetchedData);
                        })
                        document.querySelector('#name').value=fetchedData.name
                        document.querySelector("#class").value=fetchedData.classes;
                        document.querySelector("#age").value=fetchedData.age;
                        document.querySelector("#address").value=fetchedData.address;
                        document.querySelector('.add-update-btn').innerHTML='Update Data'

                    }
                    else 
                     {
                        toast("Error in fetchin data");
                     }
            })
                
}

const updateNow=()=>{
    // fetch key from localStorage
    const key=localStorage.getItem('update_key'); 
    console.log("local storage key=",key);

    const name=document.querySelector('#name').value;
    const classes=document.querySelector("#class").value;
    const age=document.querySelector("#age").value;
    const address=document.querySelector("#address").value;

    if(name=='' || classes=='' || age=='' || address==''){
        loader.style.display='none';
        return toast("Please fill all the fields");
    }

    
    
    // update successfully message show but not acutal updation occur
    
    // db.ref('Students'+key).update({
    //     address:address,
    //     age:age,
    //     classes:classes,
    //     name:name,      
       
        
    // }).then(()=>{
    //     alert("Updated successfully");
    // }).catch(()=>{
    //     alert("error in updation");
    // })

    db.ref('Students').child(key).update({
        address:address,
        age:age,
        classes:classes,
        name:name,
        
    }).then(()=>{
        
        toast("Updated successfully");
        // clear field after adding data
        document.querySelector('#name').value="";
        document.querySelector("#class").value="select Course";
        document.querySelector("#age").value="";
        document.querySelector("#address").value="";
        loader.style.display='none';
        // display after update
        displayData();
    }).catch(()=>{
        toast("error in updation");
    })
     
}

// deleting data
const deleteData=(key)=>{
     console.log("Delete key=",key);
     loader.style.display='inline';
    // Delete Successfully message show but not acutal deletion occur

    // db.ref('Students'+key).remove().then(()=>{
    //     alert("Deleted successfully");
    //     // re-route
    //     window.location.href="/";
    //  }).catch(()=>{
    //     alert("Error in deletion");
    // })

      db.ref('Students').child(key).remove().then(()=>{
        loader.style.display='none';
        toast("Deleted successfully");
        
        // display data
          displayData();
     }).catch(()=>{
        toast("Error in deletion");
     })
}


// Add  Read and Update data 
 document.querySelector('.add-update-btn').addEventListener("click",()=>{

        // target button 
         const button=document.querySelector("button");
         loader.style.display='inline';
         
         
         // add data in realtime database
         if(button.innerHTML=='Add Data'){

        const name=document.querySelector('#name').value;
        const classes=document.querySelector("#class").value;
        const age=document.querySelector("#age").value;
        const address=document.querySelector("#address").value;

        if(name=='' || classes=='' || age=='' || address==''){
            loader.style.display='none';
            return toast("Please fill all the fields");
        }

        db.ref('Students').push({
            name:name,
            classes:classes,
            age:age,
            address:address
        }).then(()=>{
            
           // clear field after adding data
           document.querySelector('#name').value="";
           document.querySelector("#class").value="select Course";
           document.querySelector("#age").value="";
           document.querySelector("#address").value="";
           loader.style.display='none';
           toast("Added successfully");
           // display after adding data
           displayData();
       
        }).catch((err)=>{
            toast(err.message);
        })
        
        
         } // update data in realtime database
         else {
            console.log("update function")
              updateNow()
           }
                
 })
 const displayData=()=>{

        // let isWait=true;
        // setTimeout(()=>{
        //     console.log("first")
        //     isWait=false
        // },5000)
        //reset previous card
        document.querySelector('.card-container').innerHTML = "";


        if(students.length==0){
            console.log("working");
            document.querySelector('.loader').style.display="block";
        }
       
        
       

        // reading from reatime database
        db.ref('Students').get().then((snapshot)=>{
            
            if(snapshot.exists()){                
               
                // clear old data
                students=[];
                snapshot.forEach((childSnapshot) => {
                    const key=childSnapshot.key;
                    const data = childSnapshot.val();    // { name, age, address, classes }
                    const {name,age,address,classes}=data;
                    
                    
                    students.push({
                        key:key,
                        name:name,
                        age:age,
                        address:address,
                        classes:classes
                    });
                    
                    
                  });
            }
            else{
                
                toast('No Data found'); 
                document.querySelector('.loader').style.display="none";
                return;
            }
            if(students.length>0){
                document.querySelector('.loader').style.display="none";
            }

           
              
            

            // apply map method to students and convert into a card for all data

            students.map((student)=>{
               const card=document.createElement('div');
               card.classList.add('card');
               card.style.display="inline-block";
            //    card.style.width="200px";
               card.style.margin="1rem";
            //    card.style.margin="2rem";
            //    card.style.backgroundColor="#f0f0f0";
               card.style.borderRadius="10px";
               card.style.boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)";
            //    card.style.margin="0 auto";
               card.style.padding="1rem";

               card.innerHTML=`
               <div class="card-body" style="text-align:center;">
               <b class='card-title'>id:${student.key}</b>
               <h5 class="card-title">Name:${student.name}</h5>
               <p class="card-text">Course:${student.classes}</p>
               <p class="card-text">Age:${student.age}</p>
               <p class="card-text">Address:${student.address}</p>
               </div>
               <button onClick="updateData('${student.key}')" class='update-btn'  style="width:90%;margin:0.3rem;padding:0.5rem;">Update</button>
               <button onClick="deleteData('${student.key}')" class='delete-btn' style="width:90%;margin:0.3rem;padding:0.5rem;">Delete</button>
               `;
               document.querySelector('.card-container').appendChild(card);
                
            })

        })
 }

 displayData();

 const toast=(message)=>{
     const toast=document.querySelector('.toast');
     console.log("toast working");
     toast.innerHTML=message;
     toast.style.display="block";
     setTimeout(()=>{
         toast.style.display="none"; 
     },4000)
 }

