"use strict";
(() => {
  const form = document.getElementById("rsvp-form");
  if (!form) return;
  const attending = form.querySelectorAll('input[name="attendance"]');
  const details = document.getElementById("attending-details");
  const partner = document.getElementById("id_partner_attending");
  const partnerFields = document.getElementById("partner-fields");
  const children = document.getElementById("id_children_count");
  function update() {
    details.hidden = form.querySelector('input[name="attendance"]:checked')?.value !== "yes";
    partnerFields.hidden = !partner.checked;
    const count = Number(children.value || 0);
    form.querySelectorAll(".child-fields").forEach(section => {
      section.hidden = Number(section.dataset.child) > count;
    });
  }
  attending.forEach(input => input.addEventListener("change", update));
  partner.addEventListener("change", update);
  children.addEventListener("change", update);
  update();
})();
