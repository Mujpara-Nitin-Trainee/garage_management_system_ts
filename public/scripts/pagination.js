const getData = async (page = 1, garage) => {
  const jsonData = await fetch(
    "/owner/slots/getAllSlots?page=" + page + "&garage=" + garage
  );
  var data = await jsonData.json();
  return [
    data.result,
    data.startIndex,
    data.endIndex,
    data.count,
    data.totalPage,
  ];
};

const populateData = async (pageNumber = 1) => {
  var select = document.querySelector("#garagesDropdown");
  var data = await getData(pageNumber, select.value);
  const tableNode = document.getElementById("table");
  while (tableNode.childNodes.length != 2) {
    tableNode.removeChild(tableNode.lastChild);
  }

  data[0].forEach((element) => {
    var tr = document.createElement("tr");
    tr.classList.add("tr-class");
    tr.classList.add("font-family");
    let i = 0;
    Object.keys(element).forEach((ele) => {
      var td = document.createElement("td");
      td.classList.add("font-family");

      if (ele == "availability_status") {
        td.classList.add("flex-status");
        var div = document.createElement("div");
        if (element[ele] == "1") {
          div.classList.add("active");
          div.innerText = "Active";
        } else {
          div.classList.add("deactive");
          div.innerText = "Deactive";
        }
        td.appendChild(div);
        tr.appendChild(td);
      } else if (i == 2) {
        var td2 = document.createElement("td");
        td2.classList.add("font-family");
        var date = element[ele];
        td2.innerText = date.split(" ")[0];
        tr.appendChild(td2);
        td.innerText = date.split(" ")[1];
        tr.appendChild(td);
      } else if (i == 3) {
        var time = element[ele];
        td.innerText = time.split(" ")[1];
        tr.appendChild(td);
      } else {
        tr.appendChild(td);
        td.innerText = element[ele];
      }
      i++;
    });
    var td = document.createElement("td");
    var dustbin = document.createElement("img");
    dustbin.src = "/icons/delete.svg";
    dustbin.setAttribute("onclick", `deleteSlot(${element.id})`);
    dustbin.setAttribute("class", "cursor-pointer");
    td.appendChild(dustbin);
    tr.appendChild(td);
    var table = document.getElementById("table");
    table.appendChild(tr);
  });
  var text = document.querySelector(".pagination-text");
  var max = data[1] + 1;
  document.querySelector(".current").innerText = pageNumber;
  if (data[4] == pageNumber) {
    text.innerText =
      "Showing " + max + " to " + data[3] + " of " + data[3] + " entries ";
  } else {
    text.innerText =
      "Showing " + max + " to " + data[2] + " of " + data[3] + " entries ";
  }
  return [data[4]];
};

var next = document.querySelector("#next");
var prev = document.querySelector("#prev");
next.addEventListener("click", async () => {
  var pid = parseInt(document.querySelector(".current").innerText);
  const pageNumber = pid + 1;
  var select = document.querySelector("#garagesDropdown");
  var maxPage = await getData(pageNumber, select.value);
  if (maxPage[4] >= pid + 1) {
    const pageCount = await populateData(pageNumber);

    document.querySelector(".current").innerText = pid + 1;
  }
});

prev.addEventListener("click", async () => {
  var pid = parseInt(document.querySelector(".current").innerText);
  if (pid - 1 != 0) {
    document.querySelector(".current").innerText = pid - 1;
    const pageNumber = pid - 1;
    populateData(pageNumber);

    if (pid - 1 == 0) {
      prev.disabled = true;
    } else {
      next.disabled = false;
    }
  }
});
