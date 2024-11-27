AOS.init();

let currentPage = 1;
const jobsPerPage = 12;
let isFetching = false;

async function checkUserAuthentication() {
  const response = await fetch(
    `http://${import.meta.env.VITE_BACKEND_URL}/user`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (response.ok) {
    const data = await response.json();
    if (!data.user) {
      window.location.href = `http://${
        import.meta.env.VITE_FRONTEND_URL
      }`;
    }
  }
}
checkUserAuthentication();

async function fetchJobIds(page) {
  if (isFetching) {
    return;
  }
  isFetching = true;
  window.removeEventListener("scroll", handleScroll);
  document.getElementById("loading").classList.remove("d-none");

  try {
    const response = await fetch(
      `http://${
        import.meta.env.VITE_BACKEND_URL
      }/job?page=${page}&limit=${jobsPerPage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const jobs = await response.json();
    jobs.forEach((job) => {
      createJobCard(job);
    });
    isFetching = false;
    document.getElementById("loading").classList.add("d-none");

    if (jobs.length >= jobsPerPage) {
      window.addEventListener("scroll", handleScroll, false);
    }
  } catch (error) {
    console.error("Error fetching job IDs:", error);
    isFetching = false;
  }
}

async function createJobCard(job) {
  const jobId = job.id;
  const card = document.createElement("div");
  const date = new Date(job.created_date);
  card.className = "col-md-3";

  const cardHtml = `
              <div class="card h-10">
                <div style="border-radius: 20%">
                  <div class="position-relative w-100" style="aspect-ratio : 1">
                    <div class="position-absolute spinner-border z-0 top-50 start-50 translate-middle" role="status">
                      <span class="sr-only top-0"></span>
                    </div>
                    <img src="http://${
                      import.meta.env.VITE_BACKEND_URL
                    }/job/${jobId}" class="position-absolute card-img-top z-1" alt="Job Image ${jobId}">
                  </div>
                  <div class="card-body">
                    <h6 class="ml-4 m-0 fw-bold">
                      ${
                        job.type.substr(0, 1) +
                        job.type.substr(1, job.type.length).toLowerCase()
                      }
                    </h6>
                    <small class="ml-4 m-0">
                      ${date.toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </small>
                  </div>
                </div>
              </div>
            `;
  card.innerHTML = cardHtml;
  document.getElementById("job-container").appendChild(card);
}

function handleScroll() {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 100
  ) {
    currentPage++;
    fetchJobIds(currentPage);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchJobIds(currentPage);
});