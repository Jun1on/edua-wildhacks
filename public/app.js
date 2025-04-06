// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Form References
    const tutorForm = document.getElementById('tutorForm');
    const summarizeForm = document.getElementById('summarizeForm');
    const quizForm = document.getElementById('quizForm');
    const recommendForm = document.getElementById('recommendForm');

    // Response Container References
    const tutorResponse = document.getElementById('tutorResponse');
    const tutorAnswer = document.getElementById('tutorAnswer');
    const summaryResponse = document.getElementById('summaryResponse');
    const summaryContent = document.getElementById('summaryContent');
    const quizResponse = document.getElementById('quizResponse');
    const quizQuestions = document.getElementById('quizQuestions');
    const recommendResponse = document.getElementById('recommendResponse');
    const recommendContent = document.getElementById('recommendContent');

    // Helper function to show loading state
    function showLoading(button) {
        const originalText = button.textContent;
        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
        button.disabled = true;
        return originalText;
    }

    // Helper function to restore button state
    function hideLoading(button, originalText) {
        button.innerHTML = originalText;
        button.disabled = false;
    }

    // Handle AI Tutor Form Submission
    tutorForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const topic = document.getElementById('topic').value.trim();
        const question = document.getElementById('question').value.trim();
        
        if (!topic || !question) {
            alert('Please enter both a topic and a question.');
            return;
        }
        
        const submitBtn = tutorForm.querySelector('button[type="submit"]');
        const originalBtnText = showLoading(submitBtn);
        
        try {
            const response = await fetch('/api/tutor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ topic, question })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                tutorAnswer.textContent = data.answer;
                tutorResponse.classList.remove('d-none');
                // Scroll to response
                tutorResponse.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert(`Error: ${data.error || 'Failed to get response'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            hideLoading(submitBtn, originalBtnText);
        }
    });

    // Handle Summarize Form Submission
    summarizeForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const content = document.getElementById('content').value.trim();
        
        if (!content) {
            alert('Please enter content to summarize.');
            return;
        }
        
        const submitBtn = summarizeForm.querySelector('button[type="submit"]');
        const originalBtnText = showLoading(submitBtn);
        
        try {
            const response = await fetch('/api/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                summaryContent.textContent = data.summary;
                summaryResponse.classList.remove('d-none');
                // Scroll to response
                summaryResponse.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert(`Error: ${data.error || 'Failed to summarize content'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            hideLoading(submitBtn, originalBtnText);
        }
    });

    // Handle Quiz Form Submission
    quizForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const topic = document.getElementById('quizTopic').value.trim();
        const difficulty = document.getElementById('difficulty').value;
        
        if (!topic) {
            alert('Please enter a quiz topic.');
            return;
        }
        
        const submitBtn = quizForm.querySelector('button[type="submit"]');
        const originalBtnText = showLoading(submitBtn);
        
        try {
            const response = await fetch('/api/quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ topic, difficulty })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Check if we have structured quiz data or raw text
                if (data.quiz) {
                    renderQuiz(data.quiz);
                } else if (data.rawQuiz) {
                    quizQuestions.textContent = data.rawQuiz;
                } else {
                    throw new Error('Invalid quiz format received');
                }
                
                quizResponse.classList.remove('d-none');
                // Scroll to response
                quizResponse.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert(`Error: ${data.error || 'Failed to generate quiz'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            hideLoading(submitBtn, originalBtnText);
        }
    });

    // Helper function to render quiz
    function renderQuiz(quizData) {
        quizQuestions.innerHTML = '';
        
        quizData.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'quiz-question';
            
            const questionTitle = document.createElement('h5');
            questionTitle.textContent = `Question ${index + 1}: ${question.question}`;
            
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quiz-options';
            
            // Create options
            question.options.forEach((option, optionIndex) => {
                const optionWrapper = document.createElement('div');
                
                const optionInput = document.createElement('input');
                optionInput.type = 'radio';
                optionInput.name = `question-${index}`;
                optionInput.id = `question-${index}-option-${optionIndex}`;
                optionInput.value = option;
                
                const optionLabel = document.createElement('label');
                optionLabel.htmlFor = `question-${index}-option-${optionIndex}`;
                optionLabel.textContent = option;
                
                optionWrapper.appendChild(optionInput);
                optionWrapper.appendChild(optionLabel);
                optionsDiv.appendChild(optionWrapper);
            });
            
            // Add answer as data attribute (hidden from user)
            questionDiv.dataset.answer = question.answer;
            
            questionDiv.appendChild(questionTitle);
            questionDiv.appendChild(optionsDiv);
            quizQuestions.appendChild(questionDiv);
        });
    }

    // Handle Recommendation Form Submission
    recommendForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const interests = document.getElementById('interests').value.trim();
        const level = document.getElementById('skillLevel').value;
        
        if (!interests) {
            alert('Please enter your interests.');
            return;
        }
        
        const submitBtn = recommendForm.querySelector('button[type="submit"]');
        const originalBtnText = showLoading(submitBtn);
        
        try {
            const response = await fetch('/api/recommend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ interests, level })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                recommendContent.textContent = data.recommendations;
                recommendResponse.classList.remove('d-none');
                // Scroll to response
                recommendResponse.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert(`Error: ${data.error || 'Failed to get recommendations'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            hideLoading(submitBtn, originalBtnText);
        }
    });

    // Navigation Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}); 