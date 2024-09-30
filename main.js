document.querySelector('.recommendation').style.opacity = 1;


// Fetch the CSV file
async function fetchCSV() {
    try {
        // Ensure the correct path to your CSV file here.
        const response = await fetch('megaGymDataset.csv'); // Adjust path as needed
        if (!response.ok) throw new Error('Failed to load CSV file');
        const data = await response.text();
        const parsedData = Papa.parse(data, { header: true }).data;

        console.log("CSV data loaded successfully:", parsedData); // Debug: Check if CSV is loaded
        return parsedData;
    } catch (error) {
        console.error("Error fetching CSV:", error);
        return [];
    }
}

// Filter exercises based on user input
async function filterExercises(userInput) {
    const dataset = await fetchCSV();

    if (dataset.length === 0) {
        console.error("No data loaded from CSV.");
        return [];
    }

    // Normalize input and CSV data (trim and lowercase)
    const filteredExercises = dataset.filter(exercise => {
        return exercise.Level && exercise.Equipment && exercise.BodyPart && exercise.Type && 
               exercise.Level.trim().toLowerCase() === userInput.level.trim().toLowerCase() &&
               exercise.Equipment.trim().toLowerCase() === userInput.equipment.trim().toLowerCase() &&
               exercise.BodyPart.trim().toLowerCase() === userInput.bodyPart.trim().toLowerCase() &&
               exercise.Type.trim().toLowerCase() === userInput.type.trim().toLowerCase();
    });

    console.log("Filtered exercises:", filteredExercises); // Debug: Check filtered results

    // Select at least 10 exercises or return all if less than 10
    const selectedExercises = filteredExercises.length >= 10
        ? filteredExercises.slice(0, 10)
        : filteredExercises;

    return selectedExercises;
}

// Display recommended workouts
async function recommendWorkout() {
    const level = document.getElementById('level').value;
    const equipment = document.getElementById('equipment').value;
    const bodyPart = document.getElementById('bodyPart').value;
    const type = document.getElementById('type').value;

    const userInput = { level, equipment, bodyPart, type };
    const exercises = await filterExercises(userInput);

    const recommendationDiv = document.getElementById('recommendation');
    recommendationDiv.innerHTML = ''; // Clear previous recommendations

    if (exercises.length > 0) {
        exercises.forEach((exercise, index) => {
            const workoutDiv = document.createElement('div');
            workoutDiv.innerText = `${index + 1}. ${exercise.Title}`; // Assuming 'Title' is the column name for exercise names
            recommendationDiv.appendChild(workoutDiv);
        });
    } else {
        recommendationDiv.innerText = 'No exercises found matching your criteria.';
    }
}

// Button click event to trigger recommendation
document.getElementById('recommendBtn').addEventListener('click', recommendWorkout);
