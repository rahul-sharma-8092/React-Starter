
import { useState, useEffect } from 'react';
import axios from 'axios';
import MultiSelect, { type MultiSelectOption } from '../components/ui/MultiSelect';
import { toast } from 'react-toastify';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function MultiSelectTestPage() {
    const [users, setUsers] = useState<MultiSelectOption[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<(string | number)[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 800));
                
                const response = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users');
                const userOptions = response.data.map(user => ({
                    label: user.name,
                    value: user.id,
                    email: user.email,
                    displayId: `#${user.id}`
                }));
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

    const handleChange = (newValues: (string | number)[]) => {
        setSelectedUserIds(newValues);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-lg space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">MultiSelect Demo (Columns)</h1>
                    <p className="mt-2 text-gray-600">
                        Select multiple users. Displays Name, Email, and ID in columns.
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <MultiSelect
                        label="Assign Users"
                        options={users}
                        value={selectedUserIds}
                        onChange={handleChange}
                        isLoading={isLoading}
                        isClearable
                        isSearchable
                        placeholder={isLoading ? "Loading users..." : "Select users..."}
                        selectAllLabel="Select All Users"
                        columns={[
                            { key: 'label', width: '40%' },
                            { key: 'email', width: '40%' },
                            { key: 'displayId', width: '20%' },
                        ]}
                    />
                    
                    <div className="mt-4 rounded-md bg-gray-50 p-4 text-sm text-gray-700">
                        <p className="font-medium">Selection State:</p>
                        <ul className="mt-2 list-disc list-inside">
                            <li>Count: {selectedUserIds.length}</li>
                            <li>IDs: {selectedUserIds.join(', ')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
