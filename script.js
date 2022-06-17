(
    function mounted() {
        getTableData();
    }
)();
  
  //Generating unique ID for new Input
  function guid() {
    return parseInt(Date.now() + Math.random());
  }

  //Create and Store New Member from the MODAL
  const el = document.querySelector("#saveMemberInfo");
  if (el) {
    el.addEventListener("submit", saveMemberInfo);
  }


  //Save Member Function 
  function saveMemberInfo(e) {
    e.preventDefault();

    /**
     * Form element array to cycle over to retrieve values
     * and object to store in element and value pair, later
     * used to for storing in Browser localStorage  
    **/
    const keys = ["car_no", "email", "slot"];
    const obj = {};

    //Ternery defined variable to store vehicle type from radio button
    let vehicle = document.getElementById('small').checked ? 'small' : 'large';

    keys.forEach((item, index) => {
      const result = document.getElementById(item).value;
      if (result) {

        obj[item] = result;

      }
    });obj['vehicle'] = vehicle;

    //Non User-Defined Data(Like Time and Cost)
    obj['time'] = '30:00'
    obj['cost'] = (vehicle === 'small') ? 60 : 100


    let vehicleSizeAllocation = 0;

    /**
     * Calling data from local storage
     * Also checking if slot is available
     * everything happens in a loop to check through
    **/
    var members = getMembers();
    members.forEach((item) => {
      if (obj.slot === item.slot) {
          alert("Slot currently in use. Try again with an unoccupied slot(1-15)");
          window.location.reload();
          this.preventDefault();
          return false;
      }

      if(item.vehicle === 'large'){
          vehicleSizeAllocation++;
      }

    });

    //Checking for number of large Vehicles
    if(vehicleSizeAllocation >= 5){
        alert("Slots for Large Vehicles exhausted");
        window.location.reload();
        this.preventDefault();
        return false;
    }

    /**
     * Checks if parking lot is empty or not
     * with a UI feedback, hiding and showing
     * as the case maybe
    **/
    if (!members.length) {
      $(".show-table-info").addClass("hide");
    }


    /**
     * After going through verifying and checking 
     * there's no slot use collision and storage,
     * and checking that the object  used above has
     * items in it, it's saved to local storage,the
     * form is cleaned, the new element rendered and
     * the modal box with the form is removed.
    **/
    if (Object.keys(obj).length) {
      var members = getMembers();
      obj.id = guid();
      members.push(obj);
      const data = JSON.stringify(members);
      localStorage.setItem("members", data);
      el.reset();
      insertIntoTableView(obj, getTotalRowOfTable());
      $("#addnewModal").modal("hide");

    }

  }
  

  //Get All Members previously stored in the local storage
  function getMembers() {
    const memberRecord = localStorage.getItem("members");
    let members = [];
    if (!memberRecord) {
      return members;
    } else {
      members = JSON.parse(memberRecord);
      return members;
    }
  }

  //Payment Record Storage
  function setPayments(pays){
    const paymentRecord = localStorage.getItem("payments");
    if(!paymentRecord){
      localStorage.setItem('payments',String(pays))
    }else{
      localStorage.setItem('payments', String(Number(paymentRecord)+Number(pays)))
    }
  }

  //get Payment and render to payment dashboard page
  function getPayment(){
    let valueHolder = document.querySelector('#value');
    const paymentRecord = localStorage.getItem("payments");
    if(!paymentRecord){
      valueHolder.innerText = ('($)0');
    }else{
      valueHolder.innerText = '($)'+localStorage.getItem('payments')
    }
  }

  /**
   * Populating Table with stored data
   */
  function getTableData() {
    $("#member_table").find("tr:not(:first)").remove();
    const searchKeyword = $("#member_search").val();
    const members = getMembers();
    const filteredMembers = members.filter(
      ({ car_no, email, slot }, index) =>
        car_no.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        slot.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    if (!filteredMembers.length) {
      $(".show-table-info").removeClass("hide");
    } else {
      $(".show-table-info").addClass("hide");
    }
    filteredMembers.forEach((item, index) => {
      insertIntoTableView(item, index + 1);
    });
  }

  /**
   * Inserting data into the table of the view
   *
   * @param {object} item
   * @param {int} tableIndex
   */
  function insertIntoTableView(item, tableIndex) {
    const table = document.getElementById("member_table");
    const row = table.insertRow();
    const idCell = row.insertCell(0);
    const carNoCell = row.insertCell(1);
    const emailCell = row.insertCell(2);
    const timeCell = row.insertCell(3);
    const costCell = row.insertCell(4);
    const slotCell = row.insertCell(5);
    const vehicleCell = row.insertCell(6);
    const actionCell = row.insertCell(7);
    idCell.innerHTML = tableIndex;
    carNoCell.innerHTML = obfuscateIT(item.car_no);
    emailCell.innerHTML = obfMail(item.email);
    timeCell.innerHTML = item.time;
    costCell.innerHTML = item.cost;
    slotCell.innerHTML = `<span class="tag">${item.slot}</span>`;
    vehicleCell.innerHTML = item.vehicle;
    const guid = item.id;
    actionCell.innerHTML = `<button class="btn btn-sm btn-danger" onclick="showDeleteModal(${guid})">PAY</button>`;
  }


  /**
   * Get Total Row of Table
   **/
  function getTotalRowOfTable() {
    const table = document.getElementById("member_table");
    return table.rows.length;
  }

  /**
   * Show Delete/Pay Confirmation Dialog Modal
   *
   * @param {int} id
   **/
  function showDeleteModal(id) {
    $("#deleted-member-id").val(id);
    $("#deleteDialog").modal();
  }


  /**
   * Starring function for Plate Numbers
  **/
  function obfuscateIT(item){
    let entry = String(item);
    let entryCentre = Math.floor(entry.length/2);
    let newText = entry[0] + '*'.repeat(entryCentre) + entry.slice(entry.length - entryCentre+1)
    return newText;
  }

  //Starring the mail Add
  function obfMail(item){
    let entry = String(item);
    let side1 = entry.split('@');
    let oIT1 = obfuscateIT(side1[0]);
    let summary = oIT1+'@'+side1[1]
    return summary;
    }


  /**
   * Delete(Pay) single member
   */
  function deleteMemberData() {
    const id = $("#deleted-member-id").val();
    const allMembers = getMembers();
    const storageUsers = JSON.parse(localStorage.getItem("members"));
    let newData = [];
    newData = storageUsers.filter((item, index) => item.id != id);
    let paymentData = [];
    paymentData = storageUsers.filter((item, index) => item.id == id);
    setPayments(paymentData[0].cost)
    const data = JSON.stringify(newData);
    localStorage.setItem("members", data);
    $("#member_table").find("tr:not(:first)").remove();
    $("#deleteDialog").modal("hide");
    getTableData();
  }


  // function watchTIme(id){
  //   const id = id;
  //   const storageUsers = JSON.parse(localStorage.getItem("members"));
  //   let newData = [];
  // }