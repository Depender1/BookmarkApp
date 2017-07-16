//Listen for Form Submit
document.getElementById('myForm').addEventListener('submit', saveBookmark);
window.addEventListener('load', getBookmarks);

function saveBookmark(e){
  //Geting Values from Input Fields
  let siteName = document.getElementById('siteName').value;
  let siteUrl = document.getElementById('siteUrl').value;

  if(!formValidation(siteName, siteUrl)){
    return false;
  }

  let bookmark = {
    name: siteName,
    url: siteUrl
    //add an id here so you can dlete from local storage easiily
  }

  //check if bookmarks is null or not
  if(localStorage.getItem('bookmarks') === null){
    //Create array
    let bookmarks = [];
    //add to array
    bookmarks.push(bookmark);
    //Save to Local Storage
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  } else {
    //Fetch from local storage
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));

    //Checking whether exists or not


    //adding to it
    bookmarks.push(bookmark);
    //re-setting
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }

  //Cleaning up the form
  document.getElementById('myForm').reset();

  //Update dom
  getBookmarks();

    e.preventDefault(); //Prevent Submitting
}





function deleteBookmark(url){
 //retrieve current bookmarks
 let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));

 //looping on all
 for (let b in bookmarks){
 if(bookmarks[b].url === url){
   //removing it
   bookmarks.splice(b,1);
   break;
 }
}
//Updating in array
localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

//Update dom
getBookmarks();
};



//Displaying

function getBookmarks(){
   let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
   //Output
   let bookmarksResults = document.getElementById('bookmarksResults');
   //Build Output
   bookmarksResults.innerHTML = "";
     for (let a in bookmarks){
     let name = bookmarks[a].name;
     let url =  bookmarks[a].url;
     bookmarksResults.innerHTML += `<div class="well"> <h3> ${name} <a class="btn btn-default"
     target="_blank" href=${url} >Visit</a>  <a onclick='deleteBookmark("${url}")' class="btn btn-danger"
     >Delete</a></h3></div>`
   }
 };

//Form Validation
function formValidation(siteName, siteUrl){
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  if(!siteName || !siteUrl){
    alert("Please Fill in the Form");
    return false;
  }
  let expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  let regex = new RegExp(expression);
  if(!siteUrl.match(regex)){
    alert('Please Use a Valid URL');
    return false;
  }
  for (let d in bookmarks){
  if(bookmarks[d].name.toLowerCase() == siteName.toLowerCase()){
    alert('Website Already Bookmarked');
    return false;
  }
 }
  return true;
}
