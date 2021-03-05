export default function postEmailToMailingList(emailAddress) {
    const apiURL = process.env.REACT_APP_API_URL;
    return fetch(`${apiURL}mailing_list`, {
            method: "POST",
            headers: new Headers({
                'Content-type': 'application/json',
            }),
            body: JSON.stringify({email_address: emailAddress})
        }

    )

}

