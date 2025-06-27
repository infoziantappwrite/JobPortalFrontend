import React, { useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient'; // Adjust path if needed

const UploadJsonAI = () => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (uploading) {
            toast.warn("Please wait for the current upload to finish.");
            return;
        }

        setUploading(true);

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const jsonData = JSON.parse(event.target.result);

                const courseArray = Array.isArray(jsonData) ? jsonData : [jsonData];

                for (let index = 0; index < courseArray.length; index++) {
                    const course = courseArray[index];

                    // 🔍 Validate required fields
                    const requiredFields = [
                        'title', 'description', 'price', 'image', 'instructor',
                        'duration', 'level', 'topics', 'tags', 'curriculum',
                        'isPublished', 'featured'
                    ];

                    for (let field of requiredFields) {
                        if (!(field in course)) {
                            toast.error(`Course ${index + 1}: Missing field: ${field}`);
                            continue;
                        }
                    }

                    if (course.isPublished && course.featured) {
                        toast.error(`Course ${index + 1}: Only one of "isPublished" or "featured" can be true.`);
                        continue;
                    }

                    if (!Array.isArray(course.curriculum) || course.curriculum.length === 0) {
                        toast.error(`Course ${index + 1}: Curriculum must be a non-empty array.`);
                        continue;
                    }

                    const validCurriculum = course.curriculum.every(section =>
                        section.title?.trim() &&
                        Array.isArray(section.lessons) &&
                        section.lessons.every(
                            lesson => lesson.title?.trim() && lesson.videoUrl?.trim()
                        )
                    );

                    if (!validCurriculum) {
                        toast.error(`Course ${index + 1}: Invalid curriculum structure.`);
                        continue;
                    }

                    // 🧾 Prepare payload
                    const payload = {
                        ...course,
                        tags: Array.isArray(course.tags) ? course.tags.map(t => t.trim()) : [],
                        topics: Array.isArray(course.topics) ? course.topics.map(t => t.trim()) : [],
                    };

                    try {
                        await apiClient.post('/superadmin/course', payload, {
                            withCredentials: true,
                        });

                        toast.success(`Course ${index + 1} uploaded successfully.`);
                    } catch (err) {
                        console.error(`Error uploading Course ${index + 1}:`, err);
                        toast.error(`Course ${index + 1}: Upload failed.`);
                    }
                }

            } catch (err) {
                toast.error("Invalid JSON file format.");
                console.error(err);
            } finally {
                setUploading(false);
            }
        };

        reader.readAsText(file);
    };

    return (
        <div>
            <label className="inline-block px-4 py-2 rounded-md border border-blue-600 text-blue-700 hover:bg-blue-50 transition text-sm font-medium cursor-pointer">
                {uploading ? "Uploading..." : "Upload Course JSON"}
                <input
                    type="file"
                    accept="application/json"
                    onChange={handleFileChange}
                    hidden
                />
            </label>
        </div>
    );
};

export default UploadJsonAI;
