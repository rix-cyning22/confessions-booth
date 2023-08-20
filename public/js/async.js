function toHideOrNotToHide()
{
    if(document.getElementById("cntnt") && !document.getElementById("cntnt").hasChildNodes())
        document.getElementById("act-tab").classList.add("hide")
}
const delMsg = (btn) => {
    const msgId = btn.parentNode.querySelector("[name=eventName]").value;
    const csrfToken = btn.parentNode.querySelector("[name=_csrf]").value;
    const msg = btn.parentNode;
    fetch("/msg/" + msgId, {
        method: "DELETE",
        headers: { "csrf-token": csrfToken }
    })
    .then(msg.parentNode.removeChild(msg))
    .then(toHideOrNotToHide())
} 
const delChnl = (btn) => {
    const chnlID = btn.parentNode.querySelector("[name=chnlID]").value;
    const csrfToken = btn.parentNode.querySelector("[name=_csrf]").value;
    const chnlLink = btn.parentNode;
    fetch("/channel-settings/del-channel/" + chnlID, {
        method: "POST",
        headers: { "csrf-token": csrfToken }
    })
    .then(singleMmb => {
        if (singleMmb)
        {
            var admChnl = document.getElementById(chnlID);
            admChnl.parentNode.removeChild(admChnl);
        }
    })
    .then(chnlLink.parentNode.removeChild(chnlLink))
    .then(() => {
        const admHead = document.getElementById("adm-head");
        const mmbHead = document.getElementById("mmb-head");
        if (admHead.getElementsByClassName("linked").length == 0)
            admHead.parentNode.removeChild(admHead);
        if (mmbHead.getElementsByClassName("linked").length == 0)
            mmbHead.parentNode.removeChild(mmbHead);
    })
    .then(() => {
        if (!document.getElementById("adm-head") && !document.getElementById("mmb-head"))
        document.getElementById("it").innerHTML = "<p> Groups you create and/or join show up here. </p>"
    })
    .then(toHideOrNotToHide())
}