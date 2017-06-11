function onContentLoaded() {
  var accountSpan = document.getElementById("account");
  accountSpan.innerHTML =
    (typeof web3 === "undefined" ? "undefined" : web3.eth.accounts[0]);
}
document.addEventListener("DOMContentLoaded", onContentLoaded);