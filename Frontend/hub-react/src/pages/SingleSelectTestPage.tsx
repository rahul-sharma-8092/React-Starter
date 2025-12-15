
import { useState, useEffect } from 'react';
import axios from 'axios';
import SingleSelect, { type SingleSelectOption } from '../components/ui/SingleSelect';
import { toast } from 'react-toastify';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function SingleSelectTestPage() {
    const [users, setUsers] = useState<SingleSelectOption[]>([]);
    const [selectedUser, setSelectedUser] = useState<SingleSelectOption | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                // Simulate a slight delay to make the loading state visible
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const response = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users');
                const userOptions = [
                    { label: "Select User", value: "", email: "", displayId: "" },
                    ...response.data.map(user => ({
                        label: user.name,
                        value: user.id,
                        email: user.email,
                        displayId: user.id
                    }))
                ];
                setUsers(userOptions);
            } catch (error) {
                console.error("Failed to fetch users", error);
                toast.error("Failed to load users");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleChange = (newValue: SingleSelectOption | null) => {
        // If "Select User" is chosen (value is empty string), treat it as clearing the selection
        if (newValue?.value === "") {
            setSelectedUser(null);
            toast.info("Selection cleared");
            return;
        }

        setSelectedUser(newValue);
        if (newValue) {
            toast.success(`Selected: ${newValue.label}`);
        } else {
            toast.info("Selection cleared");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-lg space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Multi-Column Select</h1>
                    <p className="mt-2 text-gray-600">
                        Demonstrating fetching users and displaying them in a table-like layout (Name | Email | ID).
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <SingleSelect
                        label="Select a User"
                        options={users}
                        value={selectedUser}
                        onChange={(val) => handleChange(val as SingleSelectOption)}
                        isLoading={isLoading}
                        isClearable
                        isSearchable
                        placeholder={isLoading ? "Loading..." : "Search user..."}
                        columns={[
                            { key: 'label', width: '40%' },
                            { key: 'email', width: '40%' },
                            { key: 'displayId', width: '20%' },
                        ]}
                    />
                    
                    <div className="mt-4 rounded-md bg-gray-50 p-4 text-sm text-gray-700">
                        <p className="font-medium">Selected Data:</p>
                         <div className="mt-2">
                            {selectedUser ? (
                                <ul className="list-inside list-disc space-y-1">
                                    <li>Name: {selectedUser.label}</li>
                                    <li>Email: {selectedUser.email}</li>
                                    <li>ID: {selectedUser.value}</li>
                                </ul>
                            ) : (
                                <span className="text-gray-500 italic">No user selected</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
