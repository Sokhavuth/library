class Library{
  constructor(){
    //open or create database for books
    var bookDB = localStorage.getItem('bookDB');
    if(bookDB)
      this.bookDB = JSON.parse(bookDB);
    else
      this.bookDB = [];
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
        var str = this.bookDB[i][j];
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
        html += `<td class="option"><a onclick="lib.editBook(${arrSearch[i]},'bikeform')" class="edit" id="'+i+'">Edit</a>|<a onclick="lib.deleteBook(${arrSearch[i]})" class="delete" >Delete</a></td>`;
        html += "</tr>";
      }

      html += "</table>";
    }
    $("#table").html(html);
  }

}//End class

var lib = new Library();