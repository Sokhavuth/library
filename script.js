class Library{
  constructor(){
    //open or create database for books
    var bookDB = localStorage.getItem('bookDB');
    if(bookDB)
      this.bookDB = JSON.parse(bookDB);
    else
      this.bookDB = [];

    //open or create database for visitors
    var visitorDB = localStorage.getItem('visitorDB');
    if(visitorDB)
      this.visitorDB = JSON.parse(visitorDB);
    else
      this.visitorDB = [];

    //open or create database for cards
    var cardDB = localStorage.getItem('cardDB');
    if(cardDB)
      this.cardDB = JSON.parse(cardDB);
    else
      this.cardDB = [];
  }
/////////////////////////////////////BOOKS//////////////////////////////////////////////////////////////////////////////////////
  showBooks(){
    var html = '<div class="add-data"><span>BOOKS</span><input onclick="lib.addBook()" type="button" value="New Book" /></div>';

    html += `<select id="bookkey">`;
    html += '<option value="title">Title</option>';
    html += '<option value="author">Author</option>';
    html += '<option value="year">Year</option>';
    html += '<option value="publisher">Publisher</option>';
    html += '<option value="pages">Pages</option>';
    html += '<option value="amount">Amount</option>';
    html += `</select>`;
    html += `<input onclick="lib.sortBooks()" type="button" value="Sort" />`;

    html += `<div id="search">`;
    html += `<input id="query" type="text" /><input onclick="lib.searchBooks()" type="button" value="Search"/>`;
    html += `</div>`;

    if(this.bookDB.length > 0){
      html += "<table>";
      html += "<tr>";
      html += "<th>ID</th>";
      for(var k in this.bookDB[0]){
        html += "<th>" + k.toUpperCase() + "</th>";
      }
      html += "<th>OPTION</th>";
      html += "</tr>";

      for(var i=0; i<this.bookDB.length; i++){
        html += "<tr>";
        html +=  "<td>" + (i+1) + "</td>";
        for(var j in this.bookDB[i]){
          html += "<td>" + this.bookDB[i][j] + "</td>";
        }
        html += `<td class="option"><a onclick="lib.editBook(${i})" class="edit" id="'+i+'">Edit</a>|<a onclick="lib.deleteBook(${i})" class="delete" >Delete</a></td>`;
        html += "</tr>";
      }

      html += "</table>";
    }
    $("#table").html(html);
    if(this.sorted)
      $("#bookkey").prop('selectedIndex', this.selectedIndex);
  }

  addBook(){
    $('#bookform').css('visibility','visible');
  }

  bookForm(){
    var title = $('#bookform').find('input[name="ftitle"]').val();
    var author = $('#bookform').find('input[name="fauthor"]').val();
    var year = $('#bookform').find('input[name="fyear"]').val();
    var publisher = $('#bookform').find('input[name="fpublisher"]').val();
    var pages = $('#bookform').find('input[name="fpages"]').val();
    var amount = $('#bookform').find('input[name="famount"]').val();

    if((title == "") || (author == "") || (year == "") || (publisher == "") || (pages == "") || (amount == "")){
      return false;
    }else{
      var intRGEX = /^[0-9]+$/;
      var intResult = (intRGEX.test(year) && intRGEX.test(pages) && intRGEX.test(amount));
      if(!intResult)
        return false;
    }

    if(this.edit){
      this.bookDB[this.id] = {title:title, author:author, year:year, publisher:publisher, pages:pages, amount:amount};
      this.edit = false;
    }else{
      this.bookDB.push({title:title, author:author, year:year, publisher:publisher, pages:pages, amount:amount});
    }

    localStorage.setItem("bookDB", JSON.stringify(this.bookDB));
  }

  editBook(id){
    var book = this.bookDB[id];

    $('#bookform').find('input[name="ftitle"]').val(book.title);
    $('#bookform').find('input[name="fauthor"]').val(book.author);
    $('#bookform').find('input[name="fyear"]').val(book.year);
    $('#bookform').find('input[name="fpublisher"]').val(book.publisher);
    $('#bookform').find('input[name="fpages"]').val(book.pages);
    $('#bookform').find('input[name="famount"]').val(book.amount);
    
    this.edit = true;
    this.id = id;

    $('#bookform').css('visibility','visible');
  }

  deleteBook(id){
    this.bookDB.splice(id,1);
    localStorage.setItem("bookDB", JSON.stringify(this.bookDB));
    this.showBooks();
  }

  sortBooks(){
    var selectedIndex = $("#bookkey option:selected").index();
    var key = $('#bookkey').val();

    this.bookDB.sort(function(a, b){
      
      if(key in {title:0, author:0, publisher:0}){
        const VALUEA = a[key].toUpperCase();
        const VALUEB = b[key].toUpperCase();

        let comparison = 0;

        if (VALUEA > VALUEB)
          comparison = 1;
        else if(VALUEA < VALUEB)
          comparison = -1;
        return comparison;

      }else if(key in {year:0, pages:0, amount:0})
        return b[key] - a[key];
    });

    this.sorted = true;
    this.selectedIndex = selectedIndex;
    this.showBooks();
  }

  searchBooks(){
    var query = $("#search #query").val();
    var arrSearch = [];

    for(var i=0; i<this.bookDB.length; i++){
      for(var j in this.bookDB[i]){
        var str = this.bookDB[i][j].toString();
        var result = str.indexOf(query);
        if(result != -1)
          arrSearch.push(i);
      }
    }

    arrSearch = [...new Set(arrSearch)];

    var html = '<div class="add-data"><span>SEARCH RESULT</span></div>';

    if(arrSearch.length > 0){
      html += "<table>";
      html += "<tr>";
      html += "<th>ID</th>";
      for(var k in this.bookDB[0]){
        html += "<th>" + k.toUpperCase() + "</th>";
      }
      html += "<th>OPTION</th>";
      html += "</tr>";

      for(var i=0; i<arrSearch.length; i++){
        html += "<tr>";
        html +=  "<td>" + (i+1) + "</td>";
        for(var j in this.bookDB[arrSearch[i]]){
          html += "<td>" + this.bookDB[arrSearch[i]][j] + "</td>";
        }
        html += `<td class="option"><a onclick="lib.editBook(${arrSearch[i]})" class="edit" id="'+i+'">Edit</a>|<a onclick="lib.deleteBook(${arrSearch[i]})" class="delete" >Delete</a></td>`;
        html += "</tr>";
      }

      html += "</table>";
    }
    if(query !== "")
      $("#table").html(html);
  }
/////////////////////////////////////////////////////////////////VISITORS/////////////////////////////////////////////////////////
  showVisitors(){
    var html = '<div class="add-data"><span>VISITORS</span><input onclick="lib.addVisitor()" type="button" value="New Visitor" /></div>';

    html += `<select id="visitorkey">`;
    html += '<option value="name">Name</option>';
    html += `</select>`;
    html += `<input onclick="lib.sortVisitors()" type="button" value="Sort" />`;

    html += `<div id="search">`;
    html += `<input id="query" type="text" /><input onclick="lib.searchVisitors()" type="button" value="Search"/>`;
    html += `</div>`;

    if(this.visitorDB.length > 0){
      html += "<table>";
      html += "<tr>";
      html += "<th>ID</th>";
      for(var k in this.visitorDB[0]){
        html += "<th>" + k.toUpperCase() + "</th>";
      }
      html += "<th>OPTION</th>";
      html += "</tr>";

      for(var i=0; i<this.visitorDB.length; i++){
        html += "<tr>";
        html +=  "<td>" + (i+1) + "</td>";
        for(var j in this.visitorDB[i])
          html += "<td>" + this.visitorDB[i][j] + "</td>";
      
        html += `<td class="option"><a onclick="lib.editVisitor(${i})" class="edit" id="'+i+'">Edit</a>|<a onclick="lib.deleteVisitor(${i})" class="delete" >Delete</a></td>`;
        html += "</tr>";
      }
    }

    html += "</table>";
  
    $("#table").html(html);
    if(this.sorted)
      $("#visitorkey").prop('selectedIndex', this.selectedIndex);
  }

  addVisitor(){
    $('#visitorform').css('visibility','visible');
  }

  visitorForm(){
    var name = $('#fname').val();
    var phone = $('#fphone').val();
  

    if((name == "") || (phone == "")){
      return false;
    }else{
      var phoneRegex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
      var numberResult = phoneRegex.test(phone);
      if(!numberResult)
        return false;
    }
    
    if(this.edit){
      this.visitorDB[this.id] = {name:name, phone:phone};
      this.edit = false;
    }else{
      this.visitorDB.push({name:name, phone:phone});
    }

    localStorage.setItem("visitorDB", JSON.stringify(this.visitorDB));
    $("#visitorform").css('visibility','hidden');
    $('#fname').val('');
    $('#fphone').val('');
    this.showVisitors();
    return false;
  }

  editVisitor(id){
    var visitor = this.visitorDB[id];

    $('#visitorform').find('input[name="fname"]').val(visitor.name);
    $('#visitorform').find('input[name="fphone"]').val(visitor.phone);
    
    this.edit = true;
    this.id = id;

    $('#visitorform').css('visibility','visible');
  }

  deleteVisitor(id){
    this.visitorDB.splice(id,1);
    localStorage.setItem("visitorDB", JSON.stringify(this.visitorDB));
    this.showVisitors();
  }

  sortVisitors(){
    var selectedIndex = $("#visitorkey option:selected").index();
    var key = $('#visitorkey').val();

    this.visitorDB.sort(function(a, b){
      
      if(key in {name:0}){
        const VALUEA = a[key].toUpperCase();
        const VALUEB = b[key].toUpperCase();

        let comparison = 0;

        if (VALUEA > VALUEB)
          comparison = 1;
        else if(VALUEA < VALUEB)
          comparison = -1;
        return comparison;
      }
    });

    this.sorted = true;
    this.selectedIndex = selectedIndex;
    this.showVisitors();
  }

  searchVisitors(){
    var query = $("#search #query").val();
    var arrSearch = [];

    for(var i=0; i<this.visitorDB.length; i++){
      for(var j in this.visitorDB[i]){
        var str = this.visitorDB[i][j].toString();
        var result = str.indexOf(query);
        if(result != -1)
          arrSearch.push(i);
      }
    }

    arrSearch = [...new Set(arrSearch)];

    var html = '<div class="add-data"><span>SEARCH RESULT</span></div>';

    if(arrSearch.length > 0){
      html += "<table>";
      html += "<tr>";
      html += "<th>ID</th>";
      for(var k in this.visitorDB[0]){
        html += "<th>" + k.toUpperCase() + "</th>";
      }
      html += "<th>OPTION</th>";
      html += "</tr>";

      for(var i=0; i<arrSearch.length; i++){
        html += "<tr>";
        html +=  "<td>" + (i+1) + "</td>";
        for(var j in this.visitorDB[arrSearch[i]]){
          html += "<td>" + this.visitorDB[arrSearch[i]][j] + "</td>";
        }
        html += `<td class="option"><a onclick="lib.editVisitor(${arrSearch[i]})" class="edit" id="'+i+'">Edit</a>|<a onclick="lib.deleteVisitor(${arrSearch[i]})" class="delete" >Delete</a></td>`;
        html += "</tr>";
      }

      html += "</table>";
    }
    if(query !== "")
      $("#table").html(html);
  }
/////////////////////////////////////////////////////////////CARD///////////////////////////////////////////////////////////////////////////
  showCards(){
    var html = '<div class="add-data"><span>CARDS</span><input onclick="lib.addCard()" type="button" value="New Card" /></div>';

    html += `<select id="cardkey">`;
    html += `<option value="visitor">Visitor</option>`;
    html += `<option value="book">book</option>`;
    html += `<option value="rent date">Rent Date</option>`;
    html += `<option value="return date">Return Date</option>`;
    html += `</select>`;
    html += `<input onclick="lib.sortCards()" type="button" value="Sort" />`;

    html += `<div id="search">`;
    html += `<input id="query" type="text" /><input onclick="lib.searchCards()" type="button" value="Search"/>`;
    html += `</div>`;

    if(this.cardDB.length > 0){
      html += "<table>";
      html += "<tr>";
      html += "<th>ID</th>";
      for(var k in this.cardDB[0]){
        html += "<th>" + k.toUpperCase() + "</th>";
      }
      html += "<th>OPTION</th>";
      html += "</tr>";

      for(var i=0; i<this.cardDB.length; i++){
        html += "<tr>";
        html +=  "<td>" + (i+1) + "</td>";
        for(var j in this.cardDB[i]){
          if(j === "return date")
            if(this.cardDB[i][j] === '30-7-1990')
              html += "<td class='option'>" + `<img onclick="lib.setReturnDate(${i},lib.cardDB[${i}].book)" src="return.png" />` + "</td>";
            else
              html += "<td class='option'>" + this.cardDB[i][j] + "</td>";
          else
            html += "<td>" + this.cardDB[i][j] + "</td>";
        }
        html += `<td class="option"><a onclick="lib.editCard(${i})" class="edit">Edit</a>|<a onclick="lib.deleteCard(${i})" class="delete" >Delete</a></td>`;
        html += "</tr>";
      }
    }

    html += "</table>";

    $("#table").html(html);
    if(this.sorted)
      $("#cardkey").prop('selectedIndex', this.selectedIndex);
  }

  addCard(){
    $('#cardform').css('visibility','visible');
  }

  addCard(){
    var books = this.bookDB;
    var visitors = this.visitorDB;

    for(var i=0; i<books.length; i++){
      var title = books[i].title;
      var amount = books[i].amount;
      if(amount > 0)
        $('#booklist').append(`<option value="${i}">${title}</option>`);

    }

    for(var i=0; i<visitors.length; i++){
      var name = visitors[i].name;
      $('#visitorlist').append(`<option value="${i}">${name}</option>`);
    }

    $('#cardform').css('visibility','visible');;
  }

  setDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    today = dd + '-' + mm + '-' + yyyy;
    return today;
  }

  cardForm(){
    var bookIndex = $("#booklist option:selected").val();
    var bookTitle = $('#booklist option:selected').text();
    var visitorName = $('#visitorlist option:selected').text();

    var cardItem = {visitor:visitorName, book:bookTitle, 'rent date':this.setDate(), 'return date':'30-7-1990'};

    if(this.edit){
      this.cardDB[this.id].book = bookTitle;
      this.cardDB[this.id].visitor = visitorName;
      this.edit = false;
    }else{
      this.cardDB.push(cardItem);
      var amount = this.bookDB[bookIndex].amount - 1;
      this.bookDB[bookIndex].amount = amount;
      localStorage.setItem("bookDB", JSON.stringify(this.bookDB));
    }
    
    localStorage.setItem("cardDB", JSON.stringify(this.cardDB));
    
    $("#cardform").css('visibility',"hidden");
    $('#booklist').empty();
    $('#visitorlist').empty();
    this.showCards();
    return false;
  }

  deleteCard(id){
    this.cardDB.splice(id,1);
    localStorage.setItem("cardDB", JSON.stringify(this.cardDB));
    this.showCards();
  }

  editCard(id){
    var card = this.cardDB[id];

    this.addCard();

    var booklist = document.getElementById("booklist");
    for(var i=0; i<booklist.options.length; i++){
      if(booklist.options[i].text === card.book) {
        booklist.selectedIndex = i;
          break;
      }
    }

    var visitorlist = document.getElementById("visitorlist");
    for(var i=0; i<visitorlist.options.length; i++){
      if(visitorlist.options[i].text === card.visitor) {
        visitorlist.selectedIndex = i;
          break;
      }
    }

    this.edit = true;
    this.id = id;
  }

  setReturnDate(id,book){
    this.cardDB[id]['return date'] = this.setDate();

    for(var i=0; i<this.bookDB.length; i++){
      if(this.bookDB[i].title === book) {
        this.id = i;
          break;
      }
    }
    
    this.bookDB[this.id].amount = this.bookDB[this.id].amount + 1;
    localStorage.setItem("cardDB", JSON.stringify(this.cardDB));
    localStorage.setItem("bookDB", JSON.stringify(this.bookDB));
    this.showCards();
  }

  sortCards(){
    var selectedIndex = $("#cardkey option:selected").index();
    var key = $('#cardkey').val();

    this.cardDB.sort(function(a, b){
      
      if(key in {visitor:0, book:0}){
        const VALUEA = a[key].toUpperCase();
        const VALUEB = b[key].toUpperCase();

        let comparison = 0;

        if(VALUEA > VALUEB) {
          comparison = 1;
        }else if(VALUEA < VALUEB){
          comparison = -1;
        }
        return comparison;
      }else if(key in {'rent date':0, 'return date':0}){
        var parts = a[key].split("-");
        var datea = new Date(parts[2], parts[1] - 1, parts[0]);
        var parts = b[key].split("-");
        var dateb = new Date(parts[2], parts[1] - 1, parts[0]);

        let comparison = 0;
        if(datea > dateb)
          comparison = -1;
        else if(datea < dateb)
          comparison = 1;
        return comparison;
      }
    });

    this.sorted = true;
    this.selectedIndex = selectedIndex;
    this.showCards();
  }

  searchCards(){
    var query = $("#search input").val();
    var arrSearch = [];

    for(var i=0; i<this.cardDB.length; i++){
      for(var j in this.cardDB[i]){
        var str = this.cardDB[i][j].toString();
        var result = str.indexOf(query);
        if(result !== -1)
          arrSearch.push(i);
      }
    }

    arrSearch = [...new Set(arrSearch)];

    var html = '<div class="add-data"><span>SEARCH RESULT</span></div>';

    if(arrSearch.length > 0){
      html += "<table>";
      html += "<tr>";
      html += "<th>ID</th>";
      for(var k in this.cardDB[0]){
        html += "<th>" + k.toUpperCase() + "</th>";
      }
      html += "<th>OPTION</th>";
      html += "</tr>";

      for(var i=0; i<arrSearch.length; i++){
        html += "<tr>";
        html +=  "<td>" + (i+1) + "</td>";
        for(var j in this.cardDB[arrSearch[i]]){
          html += "<td>" + this.cardDB[arrSearch[i]][j] + "</td>";
        }
        html += `<td class="option"><a onclick="lib.editCard(${arrSearch[i]})" class="edit">Edit</a>|<a onclick="lib.deleteCard(${arrSearch[i]})" class="delete" >Delete</a></td>`;
        html += "</tr>";
      }

      html += "</table>";
    }
    if(query !== "")
      $("#table").html(html);
  }
/////////////////////////////////////////////////////////////////STATISTICS//////////////////////////////////////////////////////////
  showStatistics(){
    var arrTopItem = this.sortStatistics();
    var arrVisitor = arrTopItem[0];
    var arrBook = arrTopItem[1];

    var html = '<div class="add-data"><span>STATISTICS</span></div>';

    if(arrVisitor.length > 0){
      html += "<table>";
      html += "<tr>";
      html += "<th>RATE</th>";
      html += "<th>TOP VISITORS</th>";
      html += "</tr>";

      for(var i=0; i<arrVisitor.length; i++){
        html += "<tr>";
        html +=  "<td style='text-align:center;width:10%;'>" + (i+1) + "</td>";
        html += "<td>" + arrVisitor[i][0] + "</td>";
        html += "</tr>";
        if(i == 4)
          break;
      }

      html += "</table>";
    }

    if(arrBook.length > 0){
      html += "<table>";
      html += "<tr>";
      html += "<th>RATE</th>";
      html += "<th>POPULAR BOOKS</th>";
      html += "</tr>";

      for(var i=0; i<arrBook.length; i++){
        html += "<tr>";
        html +=  "<td style='text-align:center;width:10%;'>" + (i+1) + "</td>";
        html += "<td>" + arrBook[i][0] + "</td>";
        html += "</tr>";
        if(i == 4)
          break;
      }

      html += "</table>";
    }

    $('#table').html(html);
  }

  sortStatistics(){
    var arrVisitor = [];
    var arrBook = [];

    for(var i=0; i<this.cardDB.length; i++){
      arrVisitor.push(this.cardDB[i].visitor);
      arrBook.push(this.cardDB[i].book);
    }

    var countVisitor = {};
    var countBook = {};

    arrVisitor.forEach(function(key) {countVisitor[key] = (countVisitor[key]||0) + 1;});
    arrBook.forEach(function(key) {countBook[key] = (countBook[key]||0) + 1;});

    arrVisitor = Object.entries(countVisitor);
    arrBook = Object.entries(countBook);
    
    arrVisitor.sort(function(a, b) {
      return b[1] - a[1];
    });

    arrBook.sort(function(a, b) {
      return b[1] - a[1];
    });

    return [arrVisitor, arrBook];
  }

}//End class

var lib = new Library();