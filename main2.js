
//this function get doms elements; :) dont like typing
function get(...selector) {
  return (selector.length > 1 ?
    document.querySelectorAll(selector[0]) :
    document.querySelector(selector[0])
  );
}

//this is the actual class with all the functionality
//when the document loads the constructor runs immediately call all those functions in it;
class Bookmark {
  constructor() {
    //this gets the doms elements
    this.form = get("#myForm");
    this.sitename = get("#siteName");
    this.siteurl = get("#siteUrl");
    this.bookmarksResults = get("#bookmarksResults");
    //this gets the doms elements

    // i bind all these functions because their context could change depending on where i call them
    //bind it makes sure the this keyword always refers to Bookmark class
    this.generateId = this.generateId.bind(this);
    this.saveBookmark = this.saveBookmark.bind(this);
    this.constructorDom = this.constructorDom.bind(this);
    this.setToLocalStorage = this.setToLocalStorage.bind(this);
    // i bind all these functions because their context could change depending on where i call them
    //bind it makes sure the this keyword always refers to Bookmark class


    //this are the two functions that runs the whole app
    //event() binds event listeners to the forms

    this.events();

    //init serves as the iife . it gets data from the database and constructs the dom.
    this.init();


  }
  //events()
  events() {
    this.form.addEventListener("submit", (e) => this.saveBookmark(e));

    //this is called even delegation ..
    //instead binding the event to each delete button ..
    //add it to their parent instead
    this.bookmarksResults.addEventListener("click", this.deleteBookmark)
  }



  saveBookmark(e) {
    e.preventDefault();
    //heres a little destructuring
    //sitename matches assignment[0]. and so on
    let [sitename, siteurl] = [this.sitename.value, this.siteurl.value];
    let bookmark = {
      sitename: sitename,
      siteurl: siteurl,
      //this is generated by this function generateId on line 79;
      id: this.generateId("bookmarks")
    };

    //  setToLocalStorage() explanation below;
    this.setToLocalStorage(bookmark, "save");
    //constructdom( explanation below)
    this.constructorDom(bookmark);

    //this returns false (!1 means false :))
    return !1;
  }

  generateId(storageName) {
    let id;
    let storagelength = JSON.parse(localStorage.getItem(storageName));
    //im gettign all the local storage items
    //i get the length of it
    //if its null the id defaults to 0 in the else statement
    //first itemm would have id 0, second id 1 because storage.length is 1 so on.
    if (storagelength) {
      id = storagelength.length;
    } else {
      id = 0;
    }
    //return the id afterwards
    // this function runs everytime we save something to the local storage
    return id;
  }


//this is my factory
//accept to parameters bookmark object and the action i want to perform.
// its done this way so that code can be reusable in a large app
  setToLocalStorage(bookmark, action) {
    //this object constains the functions;
    const actions = {
      //save method thats the book man and saves it to the localStorage
      save: function(bookmark) {
        //the or operator checks id there is anything in the localStorage
        //if not it returns an empty array;
        //same as if(bookmarks === null) {return []} else {localStorage.setItem blah blah} like your code on line 194
        let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
        bookmarks.push(bookmark);
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
        return !1;
      },
      //the get method just returns the items in the localStorage
      get: function(bookmark) {
        return JSON.parse(localStorage.getItem(bookmark));
      }
      // this functions has been made reusable. loads of methods can be add on there including deleting from
      //localStorage....  you can refactor my code and the Delete on line 159 here.
    }

    //this return statement is quite tricky;
    //its the object should the action paramenter be save actions.save will be returned which is a function.
    //i run the function straigth away with the bookmarkobj;
    //eamaple .. actions["save"](bookmark); ...>>>> actions.save(bookmark) example

    return actions[action](bookmark);
  }

  constructorDom(param) {
    let domString;
    //this is a multipurpose function.
    //i check if the argumetn passed is an array.. it means its from the localStorage
    //so i call the grandConstruct function which maps and construct the string
    //if its a single object then i construct a single string and append to dom with the construct function in the else block
    if (Array.isArray(param)) {

      domString = this.grandConstruct(param)

    } else {
      domString = this.construct(param);
    }
    //the tostring is not really necessary lol
    this.bookmarksResults.insertAdjacentHTML("afterbegin", domString.toString());
  }
  //construct function returns a dom string;
  //takes a single object
  construct(param)  {
    return `
    <div class="well" id="${param.id}"">
       <h3> ${param.sitename}
          <a class="btn btn-default" target="_blank" href=${param.siteUrl} >Visit</a>
           <a id="del" class="btn btn-danger">Delete</a>
      </h3>
    </div>
            `;
  }

  //this grandConstruct takes an array of objects maps and for each of them construct a string with the
  //construct function up there.
  //return a joined array to append to dom node
  grandConstruct(param) {
    let str = param.map(each => this.construct(each))
    return str.join("");
  }

  //deleteBookmark()
  //because of the event delegation
  //i am able to add only on event listener and track which item was clicked
  deleteBookmark(e) {
    //taret node clicked
    let node = e.target;
    //verify if its the delete buttin but checking its id
    if (node.id === "del") {
      //parentNode.parentNode traverse the dom util we reach the outmost parent of what was clicked
      //in this case div with class well
      //i gave the div an id as well .. that is matches a corresponding object in the local storage
      let nodeParent = node.parentNode.parentNode;

      //i get the data
      //ii coldnt use the get method in setToLocalStorage because i wanted the this keywords is the dom element
      // i have attached the event to.. thus bookmarksResults
      //calling this.setToLocalStorage will be an error
      let data = JSON.parse(localStorage.getItem("bookmarks"));
      //filter the data and return only those whos id isnt what we click on
      //nodeParent is the div we constructed
      let filtered = data.filter(each => each.id !== parseInt(nodeParent.id));
      localStorage.setItem("bookmarks", JSON.stringify(filtered));
      //this keyword is bookmarksResults div....
      //i can remove the child..
      this.removeChild(nodeParent)

    }
  }

//this makes a new instance of the object
//node its down here beause classes are not hoisted.
new Bookmark();
