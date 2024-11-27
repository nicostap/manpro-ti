// upload.js
async function checkUserAuthentication() {
    try {
      const response = await fetch(
        `http://${import.meta.env.VITE_BACKEND_URL}/user`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        window.location.href = `http://${import.meta.env.VITE_FRONTEND_URL}/`;
      } else {
        const data = await response.json();
        if (!data.user) {
          window.location.href = `http://${import.meta.env.VITE_FRONTEND_URL}/`;
        }
      }
    } catch (error) {
      window.location.href = `http://${import.meta.env.VITE_FRONTEND_URL}/`;
    }
  }
  checkUserAuthentication();
  
  const inputImage = document.getElementById("inputImage");
  const image = document.getElementById("image");
  const cropButton = document.getElementById("cropButton");
  const editorModal = new bootstrap.Modal(
    document.getElementById("editorModal")
  );
  const resultModal = new bootstrap.Modal(
    document.getElementById("resultModal")
  );
  let cropper;
  let jobId;
  
  const loadingSpinner = document.getElementById("loadingSpinner");
  const fetchedImage = document.getElementById("fetchedImage");
  const completeButton = document.getElementById("completeButton");
  
  inputImage.addEventListener("change", function (event) {
    const file = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        image.src = e.target.result;
        editorModal.show();
      };
      reader.readAsDataURL(file);
    }
  });
  
  document
    .getElementById("editorModal")
    .addEventListener("hidden.bs.modal", function () {
      cropper.destroy();
      image.src = "";
      inputImage.value = "";
    });
  
  document
    .getElementById("editorModal")
    .addEventListener("shown.bs.modal", function () {
      cropper = new Cropper(image, {
        dragMode: "move",
        viewMode: 3,
        autoCropArea: 0.8,
        responsive: true,
        restore: false,
        minContainerHeight: 400,
        aspectRatio: 1,
      });
    });
  
  cropButton.addEventListener("click", function (event) {
    event.preventDefault();
    if (cropper) {
      cropper.getCroppedCanvas().toBlob(function (blob) {
        const formData = new FormData();
        const paintingStyle =
          document.getElementById("paintingStyle").value;
        formData.append("file", blob, "input.jpg");
        formData.append("type", paintingStyle);
        fetch(`http://${import.meta.env.VITE_BACKEND_URL}/job`, {
          method: "POST",
          body: formData,
          credentials: "include",
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            jobId = data.jobId;
            editorModal.hide();
            resultModal.show();
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text: "An error has occurred, please try again",
              icon: "error",
              confirmButtonText: "OK",
            }).then(() => {
              editorModal.hide();
            });
          });
      }, "image/jpeg");
    }
  });
  
  async function fetchImage() {
    loadingSpinner.style.display = "block";
    completeButton.style.display = "none";
    fetchedImage.src = "/loading.svg";
  
    try {
      const response = await fetch(
        `http://${import.meta.env.VITE_BACKEND_URL}/job/${jobId}`,
        {
          credentials: "include",
        }
      );
  
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        loadingSpinner.style.display = "none";
        completeButton.style.display = "block";
        fetchedImage.src = url;
        jobId = null;
      } else {
        const modal = document.getElementById("resultModal");
        if (modal.classList.contains("show")) {
          setTimeout(fetchImage, 1000);
        }
      }
    } catch (error) {
      const modal = document.getElementById("resultModal");
      if (modal.classList.contains("show")) {
        setTimeout(fetchImage, 1000);
      }
    }
  }
  
  document
    .getElementById("resultModal")
    .addEventListener("shown.bs.modal", () => {
      fetchImage();
    });
  
  document
    .getElementById("resultModal")
    .addEventListener("hidden.bs.modal", () => {
      loadingSpinner.style.display = "block";
      completeButton.style.display = "none";
      fetchedImage.src = "/loading.svg";
    });