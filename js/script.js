$(document).ready(function() {
  const elApp = document.querySelector("#app");
  const elImages = Array.from(document.querySelectorAll(".gallery-image"));
  const elDetail = document.querySelector(".detail");
  const modal = document.getElementById("imageModal");
  const closeBtn = document.querySelector(".close");
  const submitFormBtn = document.getElementById("submitForm");

  function flipImages(firstEl, lastEl, change) {
    const firstRect = firstEl.getBoundingClientRect();
    const lastRect = lastEl.getBoundingClientRect();

    const deltaX = firstRect.left - lastRect.left;
    const deltaY = firstRect.top - lastRect.top;
    const deltaW = firstRect.width / lastRect.width;
    const deltaH = firstRect.height / lastRect.height;

    change();
    lastEl.parentElement.dataset.flipping = true;

    const animation = lastEl.animate([
      {
        transform: `translateX(${deltaX}px) translateY(${deltaY}px) scaleX(${deltaW}) scaleY(${deltaH})`
      },
      {
        transform: 'none'
      }
    ], {
      duration: 600,
      easing: 'cubic-bezier(.2, 0, .3, 1)'
    });

    animation.onfinish = () => {
      delete lastEl.parentElement.dataset.flipping;
    };
  }

  elImages.forEach(figure => {
    figure.addEventListener("click", () => {
      const elImage = figure.querySelector('img');
      const figcaption = figure.querySelector('figcaption').textContent;

      elDetail.innerHTML = "";
      const elClone = figure.cloneNode(true);
      elDetail.appendChild(elClone);

      const elCloneImage = elClone.querySelector('img');

      flipImages(elImage, elCloneImage, () => {
        elApp.dataset.state = "detail";
      });

      // Add a close button to the detail view
      const closeDetailBtn = document.createElement('span');
      closeDetailBtn.className = 'detail-close';
      closeDetailBtn.innerHTML = '&times;';
      elDetail.appendChild(closeDetailBtn);

      // Add a button to the detail view
      const moreInfoBtn = document.createElement('button');
      moreInfoBtn.id = 'moreInfoBtn';
      moreInfoBtn.textContent = 'Lähetä lisätietoja';
      elDetail.querySelector('.gallery-image').appendChild(moreInfoBtn);

      // Clear the textarea when a new image is opened
      document.getElementById('imageInfo').value = '';

      closeDetailBtn.addEventListener('click', revert);
      moreInfoBtn.addEventListener('click', handleMoreInfoClick);

      function handleMoreInfoClick(event) {
        event.stopPropagation();
        modal.style.display = "block";
        document.getElementById('imageObject').value = figcaption;
      }

      function revert() {
        flipImages(elCloneImage, elImage, () => {
          elApp.dataset.state = "gallery";
          elDetail.removeEventListener('click', revert);
        });
        closeDetailBtn.remove();
        moreInfoBtn.remove();
      }

      elDetail.addEventListener('click', revert);
    });
  });

  closeBtn.onclick = function() {
    modal.style.display = "none";
  };

  submitFormBtn.addEventListener('click', function() {
    const imageObject = document.getElementById("imageObject").value;
    const imageInfo = document.getElementById("imageInfo").value;

    // Construct the mailto link with the desired subject and body
    const subject = encodeURIComponent(`Hakalehto kuva numero ${imageObject}`);
    const body = encodeURIComponent(`Image Info: ${imageInfo}\n`);
    const mailtoLink = `mailto:your-email@example.com?subject=${subject}&body=${body}`;

    console.log("Submitting form with mailto:", mailtoLink); // Debugging log

    // Open the mailto link
    window.location.href = mailtoLink;

    // Close the modal
    modal.style.display = "none";
  });

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});
