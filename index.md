<!DOCTYPE html>
<html>
  <head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <link href="style.css" rel="stylesheet" >
    <script src="script.js"></script>
  </head>
  <body>
   <div id="site">
     <div id="site-title">LIBRARY</div>
     <nav id="menu">
      <a onclick="lib.showBooks()">Books</a> 
      <a onclick="lib.showVisitors()">Visitors</a>
      <a onclick="lib.showCards()">Cards</a>
      <a onclick="lib.showStatistics()">Statistics</a>
     </nav>

     <div id="content">
      <form id="bookform" onsubmit="return lib.bookForm()">
        <a>Title:</a><input name="ftitle" type="text" />
        <a>Author:</a><input name="fauthor" type="text" />
        <a>Year:</a><input name="fyear" type="text" />
        <a>Publisher:</a><input name="fpublisher" type="text" />
        <a>Pages:</a><input name="fpages" type="text" />
        <a>Amount:</a><input name="famount" type="text" />
        <a></a><input type="submit" />
      </form>

      <form id="visitorform" onsubmit="return lib.visitorForm()">
        <a>Name:</a><input id="fname" name="fname" type="text" />
        <a>Phone:</a><input id="fphone" name="fphone" type="text" />
        <a></a><input type="submit" />
      </form>

      <form id="cardform" onsubmit="return lib.cardForm()">
        <a>Books: </a><select id="booklist"></select>
        <a>Visitors: </a><select id="visitorlist"></select>
        <a></a><input type="submit" />
      </form>
    
      <div id="table"></div>
    </div><!--content-->

    <script>
      lib.showBooks();
    </script>
   </div><!--site-->
  </body>
</html>
