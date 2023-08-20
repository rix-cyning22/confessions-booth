function reply(id) 
{
    var repBtn = document.getElementById("reply-btn-" + id);
    if (!repBtn.classList.contains("clicked"))
    {
        document.getElementById("reply").value = id;
        repBtn.classList.add("clicked");
        repBtn.classList.remove("primary");
        repBtn.innerHTML = "REPLYING";
        document.getElementById("cnfs").focus();
    }
    else 
    {
        document.getElementById("reply").value = "";
        repBtn.classList.remove("clicked");
        repBtn.classList.add("primary");
        repBtn.innerHTML = "REPLY";
    }
}

function drop()
{
    var dropControl = document.getElementById("drop-control");
    var info = document.getElementById("info").classList;
    if (info.contains("hide"))
    {
        info.add("show");
        info.remove("hide");
        dropControl.innerHTML = "/\\";
    }
    else if (info.contains("show"))
    {
        info.remove("show");
        info.add("hide");
        dropControl.innerHTML = "\\/";
    }
}

function changeFile(id)
{
    const fileInput = document.getElementById(id);
    const del = document.getElementById("del-" + id).classList;
    if (fileInput.files.length == 1)
    {
        del.remove("hide")
        del.add("show");
        fileInput.setAttribute("readonly", true);
    }
    if (fileInput.files.length == 0)
    {
        fileInput.setAttribute("readonly", false);
        del.add("hide");
        del.remove("show")
    }
}
function removeFile(id) 
{
    const fileInput = document.getElementById(id);
    const del = document.getElementById("del-" + id).classList;
    fileInput.value ="";
    fileInput.setAttribute("readonly", false);
    del.add("hide");
    del.remove("show");
}
function dropMenu()
{
    document.getElementById("user-list").classList.add("show");
    document.getElementById("user-list").classList.remove("hide")
} 