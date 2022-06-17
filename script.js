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
  let el = document.querySelector("#saveMemberInfo");
  if (el) {
    el.addEventListener("submit", saveMemberInfo);
  }

  function saveMemberInfo(e) {
    e.preventDefault();

    const keys = ["car_no", "email", "d_o_a", "slot"];
    const obj = {};

    let vehicle = document.getElementById('small').checked ? 'small' : 'large';

    keys.forEach((item, index) => {
      const result = document.getElementById(item).value;
      if (result) {

        obj[item] = result;
      }
    });obj['vehicle'] = vehicle;


    var members = getMembers();
    members.forEach((item) => {
      if (obj.slot === item.slot) {
        if (obj.d_o_a === item.d_o_a) {
          alert("Can't allocate slot. Slot is not availabe on the selected day.");
          window.location.reload();
          this.preventDefault();
          return false;
        }
      }
    });

    if (!members.length) {
      $(".show-table-info").addClass("hide");
    }

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


  /**
   * Clear Create New Member Form Data0
   **/
  function clearFields() {
    $("#input_form")[0].reset();
  }
  /**
   * Get All Members already stored into the local storage
   */
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
  /**
   * Populating Table with stored data
   */
  function getTableData() {
    $("#member_table").find("tr:not(:first)").remove();
    const searchKeyword = $("#member_search").val();
    const members = getMembers();
    const filteredMembers = members.filter(
      ({ car_no, email, d_o_a, slot }, index) =>
        car_no.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        d_o_a.toLowerCase().includes(searchKeyword.toLowerCase()) ||
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
    const firstNameCell = row.insertCell(1);
    const lastNameCell = row.insertCell(2);
    const emailCell = row.insertCell(3);
    const dateOfBirthCell = row.insertCell(4);
    const slotCell = row.insertCell(5);
    const actionCell = row.insertCell(6);
    idCell.innerHTML = tableIndex;
    firstNameCell.innerHTML = item.car_no;
    lastNameCell.innerHTML = item.owner_name;
    emailCell.innerHTML = item.email;
    dateOfBirthCell.innerHTML = item.d_o_a;
    slotCell.innerHTML = `<span class="tag">${item.slot}</span>`;
    const guid = item.id;
    actionCell.innerHTML = `<button class="btn btn-sm btn-secondary" onclick="showMemberData(${guid})">View</button> <button class="btn btn-sm btn-primary" onclick="showEditModal(${guid})">Edit</button> <button class="btn btn-sm btn-danger" onclick="showDeleteModal(${guid})">Delete</button>`;
  }
  /**
   * Get Total Row of Table
   **/
  function getTotalRowOfTable() {
    const table = document.getElementById("member_table");
    return table.rows.length;
  }
  /**
   * Show Single Member Data into the modal
   *
   * @param {string} id
   */
  function showMemberData(id) {
    const allMembers = getMembers();
    const member = allMembers.find((item) => item.id == id);
    $("#show_car_no").val(member.car_no);
    $("#show_email").val(member.email);
    $("#show_d_o_a").val(member.d_o_a);
    $("#show_slot").val(member.slot);
    $("#showModal").modal();
  }

  /**
   * Show Delete Confirmation Dialog Modal
   *
   * @param {int} id
   **/
  function showDeleteModal(id) {
    $("#deleted-member-id").val(id);
    $("#deleteDialog").modal();
  }
  /**
   * Delete single member
   */
  function deleteMemberData() {
    const id = $("#deleted-member-id").val();
    const allMembers = getMembers();
    const storageUsers = JSON.parse(localStorage.getItem("members"));
    let newData = [];
    newData = storageUsers.filter((item, index) => item.id != id);
    const data = JSON.stringify(newData);
    localStorage.setItem("members", data);
    $("#member_table").find("tr:not(:first)").remove();
    $("#deleteDialog").modal("hide");
    getTableData();
  }
  /**
   * Sorting table data through type, e.g: car_no, email etc.
   *
   * @param {string} type
   */
  function sortBy(type) {
    $("#member_table").find("tr:not(:first)").remove();
    var totalClickOfType = parseInt(localStorage.getItem(type));
    if (!totalClickOfType) {
      totalClickOfType = 1;
      localStorage.setItem(type, totalClickOfType);
    } else {
      if (totalClickOfType == 1) {
        totalClickOfType = 2;
      } else {
        totalClickOfType = 1;
      }
      localStorage.setItem(type, totalClickOfType);
    }
    var searchKeyword = $("#member_search").val();
    var members = getMembers();
    var sortedMembers = members.sort(function (a, b) {
      return totalClickOfType == 2 ? a[type] > b[type] : a[type] < b[type];
    });
    sortedMembers.forEach(function (item, index) {
      insertIntoTableView(item, index + 1);
    });
  }
  