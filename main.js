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
            workoutDiv.innerText = `${index + 1}. ${exercise.Title}  -  3x set `; // Assuming 'Title' is the column name for exercise names
            recommendationDiv.appendChild(workoutDiv);
        });
    } else {
        recommendationDiv.innerText = 'No exercises found matching your criteria.';
    }
}

// Button click event to trigger recommendation
document.getElementById('recommendBtn').addEventListener('click', recommendWorkout);


// Save the workout recommendations to a file
document.getElementById('saveBtn').addEventListener('click', function() {
    const recommendationDiv = document.getElementById('recommendation');
    const recommendations = recommendationDiv.innerText ; // Get the recommendations text

    if (!recommendations) {
        alert('No recommendations to save.'); // Alert if no recommendations are available
        return;
    }

    const blob = new Blob([recommendations], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workout_recommendations.txt'; // Name of the file
    document.body.appendChild(a);
    a.click(); // Simulate click to download
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Free up memory
    
    alert('Workout recommendations saved successfully!'); // Alert after saving
});





// Function to display workout recommendation
function displayRecommendation(recommendationText) {
    const recommendationDiv = document.getElementById('recommendation');
    recommendationDiv.textContent = recommendationText;

    // Show the "Search on YouTube" button after displaying the recommendation
    const youtubeSearchBtn = document.getElementById('youtubeSearchBtn');
    youtubeSearchBtn.style.display = 'block';  // Make the button visible
}

// Function to generate workout recommendation
function getWorkoutRecommendation() {
    const level = document.getElementById('level').value;
    const equipment = document.getElementById('equipment').value;
    const bodyPart = document.getElementById('bodyPart').value;
    const type = document.getElementById('type').value;
    
    const recommendationText = `${level} ${equipment} workout for ${bodyPart} ${type}`;
    
    // Display the recommendation
    displayRecommendation(recommendationText);

    return recommendationText;
}

// Function to display workout recommendations and keep them visible on the page
function displayRecommendations(recommendations) {
    const recommendationDiv = document.getElementById('recommendation');
    recommendationDiv.innerHTML = '';  // Clear previous recommendations

    recommendations.forEach((recommendation) => {
        const recommendationElement = document.createElement('p');
        recommendationElement.textContent = recommendation;
        recommendationDiv.appendChild(recommendationElement);
    });

    // Show the "Search on YouTube" button after displaying the recommendations
    const youtubeSearchBtn = document.getElementById('youtubeSearchBtn');
    youtubeSearchBtn.style.display = 'block';  // Make the button visible
}

// Function to generate multiple workout recommendations
function getWorkoutRecommendations() {
    const level = document.getElementById('level').value;                                          // AIzaSyB03H0YPwtkbgDqSG5cezXaCfZm0Yb2g0c
    const equipment = document.getElementById('equipment').value;
    const bodyPart = document.getElementById('bodyPart').value;
    const type = document.getElementById('type').value;
    
    // Example: Generate 3 workout recommendations
    const recommendations = [
        `${level} ${equipment} workout for ${bodyPart} (${type}) - 1`,
        `${level} ${equipment} workout for ${bodyPart} (${type}) - 2`,
        `${level} ${equipment} workout for ${bodyPart} (${type}) - 3`
    ];

    // Display the recommendations
    displayRecommendations(recommendations);

    return recommendations;  // Return the recommendations for further use
}


// Function to display workout recommendations and keep them visible on the page
function displayRecommendations(recommendations) {
    const recommendationDiv = document.getElementById('recommendation');
    recommendationDiv.innerHTML = '';  // Clear previous recommendations

    recommendations.forEach((recommendation) => {
        const recommendationElement = document.createElement('p');
        recommendationElement.textContent = recommendation;
        recommendationDiv.appendChild(recommendationElement);
    });

    // Show the "Search on YouTube" button after displaying the recommendations
    const youtubeSearchBtn = document.getElementById('youtubeSearchBtn');
    youtubeSearchBtn.style.display = 'block';  // Make the button visible
}

// Function to get dynamic workout recommendations based on user input
function getWorkoutRecommendations() {
    const recommendations = [];  // This will hold the dynamic recommendations
    const level = document.getElementById('level').value;
    const equipment = document.getElementById('equipment').value;
    const bodyPart = document.getElementById('bodyPart').value;
    const type = document.getElementById('type').value;

    // Generate unique workout recommendations
    recommendations.push(`${level} ${equipment} workout for ${bodyPart} (${type})`);

    // You can use a loop or other logic to generate more unique workout recommendations based on your criteria
    for (let i = 1; i < 5; i++) {  // Adjust the number for how many unique recommendations you want
        recommendations.push(`${level} ${equipment} workout for ${bodyPart} (${type}) - Variation ${i + 1}`);
    }

    displayRecommendations(recommendations);  // Display the dynamic recommendations
    return recommendations;  // Return the dynamic recommendations for YouTube search
}

// Function to search for YouTube videos using the dynamic workout recommendations
async function searchYouTubeVideos(recommendations) {
    const apiKey = 'AIzaSyB03H0YPwtkbgDqSG5cezXaCfZm0Yb2g0c';
    const youtubeVideosDiv = document.getElementById('youtubeVideos');
    youtubeVideosDiv.innerHTML = '';  // Clear previous video results

    for (const searchQuery of recommendations) {
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(searchQuery)}&type=video&key=${apiKey}`);
            const data = await response.json();

            if (data.items.length > 0) {
                // Display the YouTube videos for the current recommendation
                data.items.forEach((video) => displayYouTubeVideo(video, searchQuery));
            }
        } catch (error) {
            console.error('Error fetching YouTube videos:', error);
        }
    }
}

// Function to display YouTube video with thumbnail next to the corresponding recommendation
function displayYouTubeVideo(video, recommendationText) {
    const youtubeVideosDiv = document.getElementById('youtubeVideos');

    // Create a container for each video
    const videoContainer = document.createElement('div');
    videoContainer.classList.add('video-item');

    // Display the recommendation text
    const recommendationElement = document.createElement('p');
    recommendationElement.textContent = recommendationText;

    // Display the video thumbnail and title
    const videoLink = `https://www.youtube.com/watch?v=${video.id.videoId}`;
    const videoTitle = video.snippet.title;
    const thumbnailUrl = video.snippet.thumbnails.default.url;

    const thumbnailImg = document.createElement('img');
    thumbnailImg.src = thumbnailUrl;
    thumbnailImg.alt = videoTitle;

    const videoTitleElement = document.createElement('a');
    videoTitleElement.href = videoLink;
    videoTitleElement.target = "_blank";
    videoTitleElement.textContent = videoTitle;

    // Append the recommendation, thumbnail, and video title to the video container
    videoContainer.appendChild(recommendationElement);
    videoContainer.appendChild(thumbnailImg);
    videoContainer.appendChild(videoTitleElement);

    // Append the video container to the YouTube videos section
    youtubeVideosDiv.appendChild(videoContainer);
}

// Event listener for "Get Recommendation" button
document.getElementById('recommendBtn').addEventListener('click', () => {
    const recommendations = getWorkoutRecommendations();  // Get actual recommendations
});

// Event listener for "Search on YouTube" button
document.getElementById('youtubeSearchBtn').addEventListener('click', () => {
    const recommendations = getWorkoutRecommendations();  // Use the actual recommendations to search YouTube
    searchYouTubeVideos(recommendations);  // Search and display YouTube videos based on the actual recommendations
});
