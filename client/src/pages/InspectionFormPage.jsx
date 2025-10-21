import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../apiConfig';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const CHECKLIST_QUESTIONS = [
    'Are water sources protected from contamination?',
    'Is pest management and control documented?',
    'Are records of soil treatment and fertilization available?',
    'Is all farm equipment properly sanitized and maintained?',
    'Are staff trained in food safety and hygiene protocols?',
];

function InspectionFormPage() {
    const { farmId } = useParams();
    const navigate = useNavigate();
    const [farm, setFarm] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchFarm = async () => {
            try {
                // Task 2.3: Refactored API call
                const response = await apiClient.get(`/api/farms/${farmId}`);
                setFarm(response.data);
            } catch (error) {
                console.error('Failed to fetch farm details', error);
            }
        };
        fetchFarm();
    }, [farmId]);

    const handleAnswerChange = (questionIndex, answer) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        const formattedAnswers = CHECKLIST_QUESTIONS.map((q, i) => ({ question: q, answer: answers[i] || 'No' }));
        const payload = { farmId: parseInt(farmId, 10), inspectorName: 'System Agronomist', answers: formattedAnswers };

        try {
            // Task 2.3: Refactored API call
            await apiClient.post(`/api/inspections`, payload);
            if (farm && farm.farmerId) {
                navigate(`/farmers/${farm.farmerId}`);
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Failed to submit inspection', error);
            setIsSubmitting(false);
        }
    };

    const allQuestionsAnswered = Object.keys(answers).length === CHECKLIST_QUESTIONS.length;
    if (!farm) return <p>Loading farm details...</p>;

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">New Inspection for: {farm.farmName}</h2>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">{CHECKLIST_QUESTIONS.map((question, index) => (<div key={index} className="bg-white p-4 rounded-lg shadow"><p className="font-medium text-gray-800">{index + 1}. {question}</p><div className="mt-3 flex space-x-4"><button type="button" onClick={() => handleAnswerChange(index, 'Yes')} className={`py-2 px-6 rounded-md font-semibold ${answers[index] === 'Yes' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Yes</button><button type="button" onClick={() => handleAnswerChange(index, 'No')} className={`py-2 px-6 rounded-md font-semibold ${answers[index] === 'No' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}>No</button></div></div>))}</div>
                <div className="mt-6"><button type="submit" disabled={!allQuestionsAnswered || isSubmitting} className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">{isSubmitting ? 'Submitting...' : 'Submit Inspection'}</button>{!allQuestionsAnswered && <p className="text-red-500 text-sm mt-2 text-center">Please answer all questions to submit.</p>}</div>
            </form>
        </div>
    );
}

export default InspectionFormPage;