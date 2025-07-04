import React, { useState } from 'react'
import { FiPlus, FiTrash2, FiBookOpen } from 'react-icons/fi';
import apiClient from '../../api/apiClient'
import { toast } from 'react-toastify';
import UploadJsonAI from './UploadJsonAI';

const AddCoursePage = () => {
   

    const [form, setForm] = useState({
        title: '',
        description: '',
        price: 'free',
        image: '',
        instructor: '',
        duration: '',
        level: 'beginner',
        topics: '',
        tags: '',
        isPublished: false,
        featured: false,
    })

    const [curriculum, setCurriculum] = useState([
        { title: '', lessons: [{ title: '', duration: '', videoUrl: '' }] },
    ])

    const [loading, setLoading] = useState(false)

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
    }

    const handleCurriculumChange = (sectionIdx, field, value) => {
        const updated = [...curriculum]
        updated[sectionIdx][field] = value
        setCurriculum(updated)
    }

    const handleLessonChange = (sectionIdx, lessonIdx, field, value) => {
        const updated = [...curriculum]
        updated[sectionIdx].lessons[lessonIdx][field] = value
        setCurriculum(updated)
    }

    const addSection = () => {
        setCurriculum([...curriculum, { title: '', lessons: [{ title: '', duration: '', videoUrl: '' }] }])
    }

    const addLesson = (sectionIdx) => {
        const updated = [...curriculum]
        updated[sectionIdx].lessons.push({ title: '', duration: '', videoUrl: '' })
        setCurriculum(updated)
    }

    const removeSection = (sectionIdx) => {
        const updated = [...curriculum]
        updated.splice(sectionIdx, 1)
        setCurriculum(updated)
    }

    const removeLesson = (sectionIdx, lessonIdx) => {
        const updated = [...curriculum]
        updated[sectionIdx].lessons.splice(lessonIdx, 1)
        setCurriculum(updated)
    }

    const handleSubmit = async (e) => {

        e.preventDefault()
        setLoading(true)
        
        const hasValidCurriculum = curriculum.some(
            section =>
                section.title.trim() &&
                section.lessons.length > 0 &&
                section.lessons.every(lesson => lesson.title.trim() && lesson.videoUrl.trim())
        )

        if (!hasValidCurriculum) {
            toast.error('Please ensure each section has a title and at least one valid lesson with a video URL.')
            setLoading(false)
            return
        }


        try {
            const payload = {
                ...form,
                tags: form.tags.split(',').map((t) => t.trim()),
                topics: form.topics.split(',').map((t) => t.trim()),
                curriculum,
            }
            //console.log('Form submitted with:', payload)

            await apiClient.post('/superadmin/course', payload, { withCredentials: true })


            //console.log(res)
            toast.success('Course added successfully!')
        } catch (err) {
            //console.log('Error adding course:', err)
            toast.error('Failed to add course. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50 p-6">
            <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-8">
                <h2 className="text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-700">
                    <FiBookOpen className="w-7 h-7 text-blue-600" />
                    Add New Course
                </h2>


                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    {/* Course Basic Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { label: 'Course Title', name: 'title' },
                            { label: 'Instructor', name: 'instructor' },
                            { label: 'Duration', name: 'duration' },
                            { label: 'Image URL', name: 'image' },
                            { label: 'Topics (comma separated)', name: 'topics' },
                            { label: 'Tags (comma separated)', name: 'tags' },
                        ].map(({ label, name }) => (
                            <div key={name}>
                                <label className="block text-[15px] font-medium text-blue-600 mb-1">{label}</label>
                                <input
                                    type="text"
                                    name={name}
                                    value={form[name]}
                                    onChange={handleFormChange}
                                    className="w-full px-4 py-2 text-sm rounded-lg border border-blue-300 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                                    placeholder={`Enter ${label.toLowerCase()}`}
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    {/* Price and Level */}
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <div>
                            <label className="block text-[15px] font-medium text-blue-600 mb-1">Price</label>
                            <select
                                name="price"
                                value={form.price}
                                onChange={handleFormChange}
                                className="w-full px-4 py-2 text-sm rounded-lg border border-blue-300 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                            >
                                <option value="free">Free</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[15px] font-medium text-blue-600 mb-1">Level</label>
                            <select
                                name="level"
                                value={form.level}
                                onChange={handleFormChange}
                                className="w-full px-4 py-2 text-sm rounded-lg border border-blue-300 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-6">
                        <label className="block text-[15px] font-medium text-blue-600 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleFormChange}
                            rows={4}
                            className="w-full px-4 py-2 text-sm rounded-lg border border-blue-300 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                            placeholder="Write a brief course description..."
                            required
                        />
                    </div>

                    {/* Published / Featured Checkboxes */}
                    <div className="flex gap-8 mt-6">
                        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                name="isPublished"
                                checked={form.isPublished}
                                onChange={handleFormChange}
                                className="accent-blue-600 w-4 h-4"
                            />
                            <span className="font-medium">Published</span>
                        </label>

                        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                name="featured"
                                checked={form.featured}
                                onChange={handleFormChange}
                                className="accent-indigo-600 w-4 h-4"
                            />
                            <span className="font-medium">Featured</span>
                        </label>
                    </div>


                    {/* Curriculum */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-blue-600">Curriculum</h3>
                        {curriculum.map((section, sectionIdx) => (
                            <div key={sectionIdx} className="border border-blue-200 p-4 rounded-md space-y-4 bg-blue-50">
                                <div className="flex justify-between items-center">
                                    <input
                                        type="text"
                                        placeholder="Section Title"
                                        value={section.title}
                                        onChange={(e) => handleCurriculumChange(sectionIdx, 'title', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
                                        required
                                    />
                                    <button type="button" onClick={() => removeSection(sectionIdx)} className="ml-3 text-red-600">
                                        <FiTrash2 />
                                    </button>
                                </div>

                                {section.lessons.map((lesson, lessonIdx) => (
                                    <div key={lessonIdx} className="grid md:grid-cols-3 gap-2 items-center">
                                        <input
                                            type="text"
                                            placeholder="Lesson Title"
                                            value={lesson.title}
                                            onChange={(e) =>
                                                handleLessonChange(sectionIdx, lessonIdx, 'title', e.target.value)
                                            }
                                            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Duration (e.g. 10:00)"
                                            value={lesson.duration}
                                            onChange={(e) =>
                                                handleLessonChange(sectionIdx, lessonIdx, 'duration', e.target.value)
                                            }
                                            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        />
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="text"
                                                placeholder="Video URL"
                                                value={lesson.videoUrl}
                                                onChange={(e) =>
                                                    handleLessonChange(sectionIdx, lessonIdx, 'videoUrl', e.target.value)
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeLesson(sectionIdx, lessonIdx)}
                                                className="text-red-600"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => addLesson(sectionIdx)}
                                    className="text-sm text-blue-700 mt-2 flex items-center gap-1"
                                >
                                    <FiPlus /> Add Lesson
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addSection}
                            className="text-sm text-blue-700 flex items-center gap-1"
                        >
                            <FiPlus /> Add Section
                        </button>
                    </div>


                    {/* Submit */}
                    <div className="flex justify-end gap-4 mt-8">
                        <UploadJsonAI/>
                            
                        <button
                            type="button"
                            onClick={() => {
                                setForm({
                                    title: '',
                                    description: '',
                                    price: 'free',
                                    image: '',
                                    instructor: '',
                                    duration: '',
                                    level: 'beginner',
                                    topics: '',
                                    tags: '',
                                    isPublished: false,
                                    featured: false,
                                })
                                setCurriculum([
                                    { title: '', lessons: [{ title: '', duration: '', videoUrl: '' }] },
                                ])
                            }}
                            className="px-5 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-50 transition text-sm font-medium"
                        >
                            Clear
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-2 rounded-md shadow hover:shadow-lg text-sm font-medium"
                        >
                            {loading ? 'Submitting...' : 'Submit Course'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default AddCoursePage
