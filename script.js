//localStorage.removeItem("myBicycleDb");
class Bicycle{
  constructor(){
    var myBicycleDb = localStorage.getItem("myBicycleDb");
    if(myBicycleDb){
      Bicycle.myBicycleDb = JSON.parse(myBicycleDb);
    }else{
      Bicycle.myBicycleDb = [];
    }

    var myCustomerDb = localStorage.getItem("myCustomerDb");
    if(myCustomerDb){
      Bicycle.myCustomerDb = JSON.parse(myCustomerDb);
    }else{
      Bicycle.myCustomerDb = [];
    }

    var myRegisterDb = localStorage.getItem("myRegisterDb");
    if(myRegisterDb){
      Bicycle.myRegisterDb = JSON.parse(myRegisterDb);
    }else{
      Bicycle.myRegisterDb = [];
    }
  }
///////////////////////////////////////////////////////////BICYCLE////////////////////////////////////////////////////////////////////////////////
  static bicycleForm(eleId){
    var brand = document.forms[eleId]['fbrand'].value;
    var country = document.forms[eleId]['fcountry'].value;
    var year = document.forms[eleId]['fyear'].value;
    var amount = document.forms[eleId]['famount'].value;
    var price = document.forms[eleId]['fprice'].value;
    if((brand == "") || (country == "") || (year == "") || (amount == "") || (price == "")){
      return false;
    }else{
      var numberRGEX = /^(?:[1-9]\d*|0)?(?:\.\d+)?$/;
      var intRGEX = /^[0-9]+$/;
      var numberResult = numberRGEX.test(price);
      var intResult = (intRGEX.test(year) && intRGEX.test(amount));
      if(!numberResult)
        return false;
      if(!intResult)
        return false;
    }
    if(Bicycle.edit){
      Bicycle.myBicycleDb[Bicycle.id] = {brand:brand, country:country, year:year, amount:amount, price:"$"+price};
      Bicycle.edit = false;
    }else{
      Bicycle.myBicycleDb.push({brand:brand, country:country, year:year, amount:amount, price:"$"+price});
    }
    localStorage.setItem("myBicycleDb", JSON.stringify(Bicycle.myBicycleDb));
  }

  static addBicycle(){
    document.getElementById("bikeform").style.visibility = "visible";
  }

  static deleteBicycle(id){
    Bicycle.myBicycleDb.splice(id,1);
    localStorage.setItem("myBicycleDb", JSON.stringify(Bicycle.myBicycleDb));
    Bicycle.showBicycle();
  }

  static editBicycle(id,eleId){
    var bicycle = Bicycle.myBicycleDb[id];

    document.forms[eleId]['fbrand'].value = bicycle.brand;
    document.forms[eleId]['fcountry'].value = bicycle.country;
    document.forms[eleId]['fyear'].value = bicycle.year;
    document.forms[eleId]['famount'].value = bicycle.amount;
    document.forms[eleId]['fprice'].value = bicycle.price.substr(1);

    Bicycle.edit = true;
    Bicycle.id = id;

    document.getElementById(eleId).style.visibility = "visible";

  }

  static showBicycle(){
    var html = '<div class="add-data"><span>BICYCLES</span><input onclick="Bicycle.addBicycle()" type="button" value="New Bicycle" /></div>';

    html += `<select id="bikekey">`;
    html += `<option value="brand">Brand</option>`;
    html += `<option value="country">Country</option>`;
    html += `<option value="year">Year</option>`;
    html += `<option value="amount">Amount</option>`;
    html += `<option value="price">Price</option>`;
    html += `</select>`;
    html += `<input onclick="Bicycle.sortBicycle()" type="button" value="Sort" />`;

    html += `<div id="search">`;
    html += `<input type="text" /><input onclick="Bicycle.searchBicycle()" type="button" value="Search"/>`;
    html += `</div>`;

    if(Bicycle.myBicycleDb.length > 0){
      html += "<table>";
      html += "<tr>";
      html += "<th>ID</th>";
      for(var k in Bicycle.myBicycleDb[0]){
        html += "<th>" + k.toUpperCase() + "</th>";
      }
      html += "<th>OPTION</th>";
      html += "</tr>";

      for(var i=0; i<Bicycle.myBicycleDb.length; i++){
        html += "<tr>";
        html +=  "<td>" + (i+1) + "</td>";
        for(var j in Bicycle.myBicycleDb[i]){
          html += "<td>" + Bicycle.myBicycleDb[i][j] + "</td>";
        }
        html += `<td class="option"><a onclick="Bicycle.editBicycle(${i},'bikeform')" class="edit" id="'+i+'">Edit</a>|<a onclick="Bicycle.deleteBicycle(${i})" class="delete" >Delete</a></td>`;
        html += "</tr>";
      }

      html += "</table>";
    }

    document.getElementById("table").innerHTML = html;

    if(Bicycle.sorted){
      document.getElementById("bikekey").selectedIndex = Bicycle.selectedIndex;
      Bicycle.sorted = false;
    }
  }

  static sortBicycle(){
    var element = document.getElementById("bikekey");
    var selectedIndex = element.selectedIndex;
    var key = element.options[selectedIndex].value;

    Bicycle.myBicycleDb.sort(function(a, b){
      
      if(key in {brand:0, country:0}){
        const VALUEA = a[key].toUpperCase();
        const VALUEB = b[key].toUpperCase();

        let comparison = 0;

        if (VALUEA > VALUEB) {
          comparison = 1;
        }else if(VALUEA < VALUEB){
          comparison = -1;
        }
        return comparison;
      }else if(key in {year:0, amount:0}){
        return b[key] - a[key];
      }else{
        const valuea = parseFloat(a[key].substr(1));
        const valueb = parseFloat(b[key].substr(1));
        return valueb - valuea;
      }
    });
    Bicycle.sorted = true;
    Bicycle.selectedIndex = selectedIndex;
    Bicycle.showBicycle();
  }

  static searchBicycle(){
    var query = $("#search input").val();
    var arrSearch = [];

    for(var i=0; i<Bicycle.myBicycleDb.length; i++){
      for(var j in Bicycle.myBicycleDb[i]){
        var str = Bicycle.myBicycleDb[i][j];
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
      for(var k in Bicycle.myBicycleDb[0]){
        html += "<th>" + k.toUpperCase() + "</th>";
      }
      html += "<th>OPTION</th>";
      html += "</tr>";

      for(var i=0; i<arrSearch.length; i++){
        html += "<tr>";
        html +=  "<td>" + (i+1) + "</td>";
        for(var j in Bicycle.myBicycleDb[arrSearch[i]]){
          html += "<td>" + Bicycle.myBicycleDb[arrSearch[i]][j] + "</td>";
        }
        html += `<td class="option"><a onclick="Bicycle.editBicycle(${arrSearch[i]},'bikeform')" class="edit" id="'+i+'">Edit</a>|<a onclick="Bicycle.deleteBicycle(${arrSearch[i]})" class="delete" >Delete</a></td>`;
        html += "</tr>";
      }

      html += "</table>";
    }
    document.getElementById("table").innerHTML = html;
  }
///////////////////////////////////////////////////////////CUSTOMERS////////////////////////////////////////////////////////////////////////
  static addCustomer(){
    document.getElementById("custform").style.visibility = "visible";
  }

  static customerForm(){
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
    
    if(Bicycle.edit){
      Bicycle.myCustomerDb[Bicycle.id] = {name:name, phone:phone};
      Bicycle.edit = false;
    }else{
      Bicycle.myCustomerDb.push({name:name, phone:phone});
    }

    localStorage.setItem("myCustomerDb", JSON.stringify(Bicycle.myCustomerDb));
    document.getElementById("custform").style.visibility = "hidden";
    $('#fname').val('');
    $('#fphone').val('');
    Bicycle.showCustomer();
    return false;
  }

  static showCustomer(){
    var html = '<div class="add-data"><span>CUSTOMERS</span><input onclick="Bicycle.addCustomer()" type="button" value="New Customer" /></div>';

    html += `<select id="custkey">`;
    html += `<option value="name">Name</option>`;
    html += `</select>`;
    html += `<input onclick="Bicycle.sortCustomer()" type="button" value="Sort" />`;

    html += `<div id="search">`;
    html += `<input type="text" /><input onclick="Bicycle.searchCustomer()" type="button" value="Search"/>`;
    html += `</div>`;

    if(Bicycle.myCustomerDb.length > 0){
      html += "<table>";
      html += "<tr>";
      html += "<th>ID</th>";
      for(var k in Bicycle.myCustomerDb[0]){
        html += "<th>" + k.toUpperCase() + "</th>";
      }
      html += "<th>OPTION</th>";
      html += "</tr>";

      for(var i=0; i<Bicycle.myCustomerDb.length; i++){
        html += "<tr>";
        html +=  "<td>" + (i+1) + "</td>";
        for(var j in Bicycle.myCustomerDb[i]){
          html += "<td>" + Bicycle.myCustomerDb[i][j] + "</td>";
        }
        html += `<td class="option"><a onclick="Bicycle.editCustomer(${i},'custform')" class="edit">Edit</a>|<a onclick="Bicycle.deleteCustomer(${i})" class="delete" >Delete</a></td>`;
        html += "</tr>";
      }

      html += "</table>";
    }

    document.getElementById('table').innerHTML = html;
  }

  static deleteCustomer(id){
    Bicycle.myCustomerDb.splice(id,1);
    localStorage.setItem("myCustomerDb", JSON.stringify(Bicycle.myCustomerDb));
    Bicycle.showCustomer();
  }

  static editCustomer(id,eleId){
    var customer = Bicycle.myCustomerDb[id];

    document.forms[eleId]['fname'].value = customer.name;
    document.forms[eleId]['fphone'].value = customer.phone;

    Bicycle.edit = true;
    Bicycle.id = id;

    document.getElementById(eleId).style.visibility = "visible";

  }

  static sortCustomer(){
    var element = document.getElementById("custkey");
    var selectedIndex = element.selectedIndex;
    var key = element.options[selectedIndex].value;

    Bicycle.myCustomerDb.sort(function(a, b){
      
      if(key in {name:0}){
        const VALUEA = a[key].toUpperCase();
        const VALUEB = b[key].toUpperCase();

        let comparison = 0;

        if (VALUEA > VALUEB) {
          comparison = 1;
        }else if(VALUEA < VALUEB){
          comparison = -1;
        }
        return comparison;
      }
    });
    Bicycle.showCustomer();
  }

  static searchCustomer(){
    var query = $("#search input").val();
    var arrSearch = [];

    for(var i=0; i<Bicycle.myCustomerDb.length; i++){
      for(var j in Bicycle.myCustomerDb[i]){
        var str = Bicycle.myCustomerDb[i][j];
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
      for(var k in Bicycle.myCustomerDb[0]){
        html += "<th>" + k.toUpperCase() + "</th>";
      }
      html += "<th>OPTION</th>";
      html += "</tr>";

      for(var i=0; i<arrSearch.length; i++){
        html += "<tr>";
        html +=  "<td>" + (i+1) + "</td>";
        for(var j in Bicycle.myCustomerDb[arrSearch[i]]){
          html += "<td>" + Bicycle.myCustomerDb[arrSearch[i]][j] + "</td>";
        }
        html += `<td class="option"><a onclick="Bicycle.editCustomer(${arrSearch[i]},'custform')" class="edit" id="'+i+'">Edit</a>|<a onclick="Bicycle.deleteCustomer(${arrSearch[i]})" class="delete" >Delete</a></td>`;
        html += "</tr>";
      }

      html += "</table>";
    }
    document.getElementById("table").innerHTML = html;
  }
/////////////////////////////////////////////////////////////////REGISTER////////////////////////////////////////////////////////////
  static showRegister(){
    var html = '<div class="add-data"><span>REGISTERS</span><input onclick="Bicycle.addRegister()" type="button" value="New Register" /></div>';

    html += `<select id="regiskey">`;
    html += `<option value="customer">Customer</option>`;
    html += `<option value="bicycle">Bicycle</option>`;
    html += `<option value="rent date">Rent Date</option>`;
    html += `<option value="return date">Return Date</option>`;
    html += `</select>`;
    html += `<input onclick="Bicycle.sortRegister()" type="button" value="Sort" />`;

    html += `<div id="search">`;
    html += `<input type="text" /><input onclick="Bicycle.searchRegister()" type="button" value="Search"/>`;
    html += `</div>`;

    if(Bicycle.myRegisterDb.length > 0){
      html += "<table>";
      html += "<tr>";
      html += "<th>ID</th>";
      for(var k in Bicycle.myRegisterDb[0]){
        html += "<th>" + k.toUpperCase() + "</th>";
      }
      html += "<th>OPTION</th>";
      html += "</tr>";

      for(var i=0; i<Bicycle.myRegisterDb.length; i++){
        html += "<tr>";
        html +=  "<td>" + (i+1) + "</td>";
        for(var j in Bicycle.myRegisterDb[i]){
          if(j === "return date")
            if(Bicycle.myRegisterDb[i][j] === '30-7-1990')
              html += "<td class='option'>" + `<img onclick="Bicycle.setReturnDate(${i},Bicycle.myRegisterDb[${i}].bicycle)" src="return.png" />` + "</td>";
            else
              html += "<td class='option'>" + Bicycle.myRegisterDb[i][j] + "</td>";
          else
            html += "<td>" + Bicycle.myRegisterDb[i][j] + "</td>";
        }
        html += `<td class="option"><a onclick="Bicycle.editRegister(${i})" class="edit">Edit</a>|<a onclick="Bicycle.deleteRegister(${i})" class="delete" >Delete</a></td>`;
        html += "</tr>";
      }

      html += "</table>";
    }
    document.getElementById('table').innerHTML = html;

    if(Bicycle.sorted){
      document.getElementById("regiskey").selectedIndex = Bicycle.selectedIndex;
      Bicycle.sorted = false;
    }
  }

  static addRegister(){
    var bicycles = Bicycle.myBicycleDb;
    var customers = Bicycle.myCustomerDb;

    for(var i=0; i<bicycles.length; i++){
      var brand = bicycles[i]['brand'];
      var amount = bicycles[i]['amount'];
      if(amount > 0)
        $('#bikelist').append(`<option value="${i}">${brand}</option>`);
    }

    for(var i=0; i<customers.length; i++){
      var name = customers[i]['name'];
      $('#customerlist').append(`<option value="${i}">${name}</option>`);
    }

    document.getElementById("regisform").style.visibility = "visible";
  }

  static registerForm(){
    var bikelist = document.getElementById("bikelist");
    var bikeIndex = bikelist.options[bikelist.selectedIndex].value;
    var bikeBrand = bikelist.options[bikelist.selectedIndex].text;

    var customerlist = document.getElementById("customerlist");
    var customerName = customerlist.options[customerlist.selectedIndex].text;

    var registerItem = {customer:customerName, bicycle:bikeBrand, 'rent date':Bicycle.setDate(), 'return date':'30-7-1990'};

    if(Bicycle.edit){
      Bicycle.myRegisterDb[Bicycle.id].bicycle = bikeBrand;
      Bicycle.myRegisterDb[Bicycle.id].customer = customerName;
      Bicycle.edit = false;
    }else{
      Bicycle.myRegisterDb.push(registerItem);
      var amount = Bicycle.myBicycleDb[bikeIndex].amount - 1;
      if(amount < 0)
        amount = 0;

      Bicycle.myBicycleDb[bikeIndex].amount = amount;
      localStorage.setItem("myBicycleDb", JSON.stringify(Bicycle.myBicycleDb));
    }
    
    localStorage.setItem("myRegisterDb", JSON.stringify(Bicycle.myRegisterDb));
    
    document.getElementById("regisform").style.visibility = "hidden";
    $('#bikelist').empty();
    $('#customerlist').empty();
    Bicycle.showRegister();
    return false;
  }

  static deleteRegister(id){
    Bicycle.myRegisterDb.splice(id,1);
    localStorage.setItem("myRegisterDb", JSON.stringify(Bicycle.myRegisterDb));
    Bicycle.showRegister();
  }

  static editRegister(id){
    var register = Bicycle.myRegisterDb[id];

    Bicycle.addRegister();

    var bikelist = document.getElementById("bikelist");
    for(var i=0; i<bikelist.options.length; i++){
      if(bikelist.options[i].text === register.bicycle) {
        bikelist.selectedIndex = i;
          break;
      }
    }

    var customerlist = document.getElementById("customerlist");
    for(var i=0; i<customerlist.options.length; i++){
      if(customerlist.options[i].text === register.customer) {
        customerlist.selectedIndex = i;
          break;
      }
    }

    Bicycle.edit = true;
    Bicycle.id = id;
  }

  static setDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    today = dd + '-' + mm + '-' + yyyy;
    return today;
  }

  static setReturnDate(id,brand){
    Bicycle.myRegisterDb[id]['return date'] = Bicycle.setDate();

    for(var i=0; i<Bicycle.myBicycleDb.length; i++){
      if(Bicycle.myBicycleDb[i].brand === brand) {
        Bicycle.id = i;
          break;
      }
    }
    
    Bicycle.myBicycleDb[Bicycle.id].amount = Bicycle.myBicycleDb[Bicycle.id].amount + 1;
    localStorage.setItem("myRegisterDb", JSON.stringify(Bicycle.myRegisterDb));
    localStorage.setItem("myBicycleDb", JSON.stringify(Bicycle.myBicycleDb));
    Bicycle.showRegister();
  }

  static sortRegister(){
    var element = document.getElementById("regiskey");
    var selectedIndex = element.selectedIndex;
    var key = element.options[selectedIndex].value;

    Bicycle.myRegisterDb.sort(function(a, b){
      
      if(key in {customer:0, bicycle:0}){
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

    Bicycle.sorted = true;
    Bicycle.selectedIndex = selectedIndex;
    Bicycle.showRegister();
  }

  static searchRegister(){
    var query = $("#search input").val();
    var arrSearch = [];

    for(var i=0; i<Bicycle.myRegisterDb.length; i++){
      for(var j in Bicycle.myRegisterDb[i]){
        var str = Bicycle.myRegisterDb[i][j];
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
      for(var k in Bicycle.myRegisterDb[0]){
        html += "<th>" + k.toUpperCase() + "</th>";
      }
      html += "<th>OPTION</th>";
      html += "</tr>";

      for(var i=0; i<arrSearch.length; i++){
        html += "<tr>";
        html +=  "<td>" + (i+1) + "</td>";
        for(var j in Bicycle.myRegisterDb[arrSearch[i]]){
          html += "<td>" + Bicycle.myRegisterDb[arrSearch[i]][j] + "</td>";
        }
        html += `<td class="option"><a onclick="Bicycle.editRegister(${arrSearch[i]},'custform')" class="edit" id="'+i+'">Edit</a>|<a onclick="Bicycle.deleteRegister(${arrSearch[i]})" class="delete" >Delete</a></td>`;
        html += "</tr>";
      }

      html += "</table>";
    }
    document.getElementById("table").innerHTML = html;
  }
/////////////////////////////////////////////////////////////////TOP RENTAL//////////////////////////////////////////////////////////
  static showTopRental(){
    var arrTopItem = Bicycle.sortTopRental();
    var arrCustomer = arrTopItem[0];
    var arrBicycle = arrTopItem[1];

    var html = '<div class="add-data"><span>TOP RENTAL</span></div>';

    if(arrCustomer.length > 0){
      html += "<table>";
      html += "<tr>";
      html += "<th>RATE</th>";
      html += "<th>TOP CUSTOMER</th>";
      html += "</tr>";

      for(var i=0; i<arrCustomer.length; i++){
        html += "<tr>";
        html +=  "<td style='text-align:center;width:10%;'>" + (i+1) + "</td>";
        html += "<td>" + arrCustomer[i][0] + "</td>";
        html += "</tr>";
        if(i == 4)
          break;
      }

      html += "</table>";
    }

    if(arrBicycle.length > 0){
      html += "<table>";
      html += "<tr>";
      html += "<th>RATE</th>";
      html += "<th>POPULAR BICYCLE</th>";
      html += "</tr>";

      for(var i=0; i<arrBicycle.length; i++){
        html += "<tr>";
        html +=  "<td style='text-align:center;width:10%;'>" + (i+1) + "</td>";
        html += "<td>" + arrBicycle[i][0] + "</td>";
        html += "</tr>";
        if(i == 4)
          break;
      }

      html += "</table>";
    }

    document.getElementById('table').innerHTML = html;
  }

  static sortTopRental(){
    var arrCustomer = [];
    var arrBicycle = [];

    for(var i=0; i<Bicycle.myRegisterDb.length; i++){
      arrCustomer.push(Bicycle.myRegisterDb[i].customer);
      arrBicycle.push(Bicycle.myRegisterDb[i].bicycle);
    }

    var countCustomer = {};
    var countBicycle = {};

    arrCustomer.forEach(function(key) {countCustomer[key] = (countCustomer[key]||0) + 1;});
    arrBicycle.forEach(function(key) {countBicycle[key] = (countBicycle[key]||0) + 1;});

    arrCustomer = Object.entries(countCustomer);
    arrBicycle = Object.entries(countBicycle);
    
    arrCustomer.sort(function(a, b) {
      return b[1] - a[1];
    });

    arrBicycle.sort(function(a, b) {
      return b[1] - a[1];
    });

    return [arrCustomer, arrBicycle];
    
  }

}//End of class
