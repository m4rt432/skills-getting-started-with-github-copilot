document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = createActivityCard({ name, ...details });
        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Create activity card element
  function createActivityCard(activity) {
    const card = document.createElement("div");
    card.className = "activity-card";

    const spotsLeft = activity.max_participants - activity.participants.length;

    card.innerHTML = `
      <h4>${activity.name}</h4>
      <p>${activity.description}</p>
      <p><strong>Schedule:</strong> ${activity.schedule}</p>
      <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
    `;

    // Add participants section
    const participantsSection = document.createElement("div");
    participantsSection.className = "participants-section";

    const participantsTitle = document.createElement("div");
    participantsTitle.className = "participants-title";
    participantsTitle.textContent = "Participantes:";
    participantsSection.appendChild(participantsTitle);

    const participantsList = document.createElement("ul");
    participantsList.className = "participants-list";

    // Assuming activity.participants is an array of participants
    if (activity.participants && activity.participants.length > 0) {
      activity.participants.forEach((participant) => {
        const li = document.createElement("li");
        li.textContent = participant;
        participantsList.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "No hay participantes inscritos";
      participantsList.appendChild(li);
    }

    participantsSection.appendChild(participantsList);
    card.appendChild(participantsSection);

    return card;
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
