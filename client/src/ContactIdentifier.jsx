import React, { useState } from 'react';
import { Send, User, Phone, Mail, CheckCircle, XCircle, Loader } from 'lucide-react';
import axios from 'axios';

const ContactIdentifier = () => {
    const [formData, setFormData] = useState({
        email: 'primary0@example.com',
        phoneNumber: '900000000'
    });
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    // const url = 'http://localhost:3000/identify';
    const url = "/identify";

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);
        try {
            console.log('Submitting form data:', formData);
            const result = await axios.post(url, formData, {
                headers: { 'Content-Type': 'application/json' }
            });

            setResponse(result.data);
        } catch (err) {
            setError(err.message || 'Failed to identify contact');
        } finally {
            setLoading(false);
        }
    };

    const clearResults = () => {
        setResponse(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        Contact Identifier
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Test your contact identification API
                    </p>
                </div>

                {/* Form and Result Section */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Form Section */}
                        <div className="w-full lg:w-1/2 p-4 border-r border-gray-100">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                        <Mail className="w-4 h-4 mr-2 text-indigo-500" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        placeholder="Enter email address"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                        <Phone className="w-4 h-4 mr-2 text-indigo-500" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        placeholder="Enter phone number"
                                        required
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            <span>Identifying...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>Identify Contact</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Results Section */}
                        {(response || error) && (
                            <div className="w-full lg:w-1/2 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800">API Response</h3>
                                    <button
                                        onClick={clearResults}
                                        className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                                    >
                                        Clear
                                    </button>
                                </div>

                                {response && (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
                                        <div className="flex items-center mb-4">
                                            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                                            <h4 className="text-green-800 font-bold text-lg">Contact Identified Successfully</h4>
                                        </div>

                                        <div className="space-y-5 text-sm">
                                            {/* Primary & Secondary IDs */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div>
                                                    <p className="text-gray-600 font-semibold mb-1">Primary Contact ID:</p>
                                                    <p className="text-green-800 font-mono text-base">{response.contact.primaryContatctId}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600 font-semibold mb-1">Secondary Contact IDs:</p>
                                                    {response.contact.secondaryContactIds.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {response.contact.secondaryContactIds.map((id, idx) => (
                                                                <span
                                                                    key={`sec-id-${idx}`}
                                                                    className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold"
                                                                >
                                                                    {id}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 italic">None</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Emails */}
                                            <div>
                                                <p className="text-gray-600 font-semibold mb-1">Emails:</p>
                                                <ul className="list-disc list-inside text-green-900 text-[15px] leading-relaxed space-y-1">
                                                    {response.contact.emails.map((email, idx) => (
                                                        <li key={`email-${idx}`} className="font-medium">{email}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Phone Numbers */}
                                            <div>
                                                <p className="text-gray-600 font-semibold mb-1">Phone Numbers:</p>
                                                <ul className="list-disc list-inside text-green-900 text-[15px] leading-relaxed space-y-1">
                                                    {response.contact.phoneNumbers.map((phone, idx) => (
                                                        <li key={`phone-${idx}`} className="font-medium">{phone}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Raw JSON */}
                                        <details className="mt-6">
                                            <summary className="cursor-pointer text-green-700 font-semibold text-sm">
                                                View Raw Response
                                            </summary>
                                            <pre className="mt-2 bg-green-100 p-3 rounded-lg text-xs text-green-800 overflow-x-auto">
                                                {JSON.stringify(response, null, 2)}
                                            </pre>
                                        </details>
                                    </div>
                                )}



                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                                        <div className="flex items-center mb-3">
                                            <XCircle className="w-6 h-6 text-red-500 mr-3" />
                                            <h4 className="text-red-800 font-semibold">Request Failed</h4>
                                        </div>
                                        <p className="text-red-700 text-sm mb-3">{error}</p>
                                        <details>
                                            <summary className="cursor-pointer text-red-700 font-medium text-sm">
                                                Request Details
                                            </summary>
                                            <div className="mt-2 bg-red-100 p-3 rounded-lg text-xs text-red-800">
                                                <p><strong>URL:</strong> {url}</p>
                                                <p><strong>Method:</strong> POST</p>
                                                <p><strong>Headers:</strong> Content-Type: application/json</p>
                                                <p><strong>Body:</strong></p>
                                                <pre>{JSON.stringify(formData, null, 2)}</pre>
                                            </div>
                                        </details>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* API Info Section */}
                <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">API Endpoint Information</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex">
                            <span className="font-medium text-gray-600 w-24">URL:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">
                                {url}
                            </code>
                        </div>
                        <div className="flex">
                            <span className="font-medium text-gray-600 w-24">Method:</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-xs">POST</span>
                        </div>
                        <div className="flex">
                            <span className="font-medium text-gray-600 w-24">Headers:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">
                                Content-Type: application/json
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactIdentifier;
