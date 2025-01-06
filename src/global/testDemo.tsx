import { Button, Drawer, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";


export function DemoDrawer() {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <div className="user-profile">
                <h1>User Profile</h1>
                <form>
                    <label >Email:</label>
                    <input type="email" id="email" name="email" required />

                    <label >First Name:</label>
                    <input type="text" id="first-name" name="first-name" required />

                    <label >Last Name:</label>
                    <input type="text" id="last-name" name="last-name" required />

                    <label >Phone:</label>
                    <input type="tel" id="phone" name="phone" required />

                    <button type="submit">Save</button>
                </form>

                <div className="profile-image">
                    <img src="https://via.placeholder.com/150" alt="Profile Image"/>
                </div>

                <div className="profile-summary">
                    <h2>Profile Summary</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
            </div>

        </>
    );
}