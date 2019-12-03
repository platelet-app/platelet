import React from 'react'

export default function Home(props) {
    return (
        <div style={{marginLeft: 30, marginTop: 100, marginRight: 30, marginBottom: 100, textAlign: "left"}}>
            <h1>Instructions for use</h1>
            <p>
                Use the menu to the left to navigate.
                <br/><br/>
                If on mobile, click the three lines at the top left to open the menu. Click outside of the popout to
                close
                it again.

                <br/><br/>
                "Sessions" refers to your shifts. If you click on that menu item, you will see a big plus sign and cards
                for any previous shifts.

                <br/><br/>
                Click the plus sign to add a new shift. Click on the new card to open it.

                <br/><br/>
                Similarly the shift view lets you add jobs with the plus sign. Time of call is automatically set.

                <br/><br/>
                Click the card to edit the job. Details are automatically saved as you add them.

                <br/><br/>
                The From and To fields let you search from a set of predefined locations by clicking on "Type to search
                locations" then selecting the result from the dropdown.

                <br/><br/>
                Currently if you search you must use the first letters of the name in the list (e.g. type "calli" to see
                Callington Road wards.)

                <br/><br/>
                You can click the white bar underneath to expand address details and make amendments.

                <br/><br/>
                You can do the same for assigning a rider.

                <br/><br/>
                Click the plus sign to add a deliverable, and select the type from the dropdown that appears.

                <br/><br/>
                Picked up and Dropped off buttons add the time automatically.

                <br/><br/>
                As items are changed, the card will move to different columns.

                <br/><br/>
                It moves to active once it is assigned to a rider. The rest is self-explanatory.

                <br/><br/>
                You can see which tasks are assigned to your account by clicking on "My Tasks" in the menu.

                <br/><br/>
                The test account has rider and coordinator roles so you can assign something to yourself ("Someone
                Person"
                on the list of users) and it will appear in the list.

                <br/><br/>
                From here you can click a card to see a simplified view of the job and use the Picked up and Dropped off
                buttons. This could be done by the rider while out on jobs.
                <h2>Known Issues</h2>
                - Sometimes on a job edit form, the contact name is not saved completely.
                <br/><br/>
                - If the page is refreshed while a job form is open, some functionality will fail (refresh the session
                detail page instead).
                <br/><br/>
                - When loading My Tasks or a Session, the cards from the last open view will show for a moment.
            </p>
        </div>
    )
}