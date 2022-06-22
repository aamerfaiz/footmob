async function getDocument() {
    // [START firestore_data_get_as_map]
    const docref = firestore.collection("tournament").doc("sims_4").collection("teams").doc(team.teamname);
    const doc = await docref.get();
    if (!doc.exists) {
        console.log('No such document!');
    } else {
        console.log('Document data:', doc.data());
    }
    // [END firestore_data_get_as_map]
}

//   GET DATA from FIRESTORE


function AddTeam() {
    const [team, setTeam] = useState({ teamname: "", budgets: "", players: [] });
    const handlechange = e => {
        const { name, value } = e.target;

        setTeam({ ...team, [name]: value });
    }
    const addteam = () => {
        firestore.collection("tournament").doc("sims_4").collection("teams").doc(team.teamname).set(team);
    }


    return (
        <>
            <form className='loginform'>
                <label>Team:
                    <input type="text" name="teamname" onChange={handlechange}></input>
                </label>
                <label>Budgets:
                    <input type="text" name="budgets" onChange={handlechange}></input>
                </label>
            </form>
            <button className="sign-in" onClick={addteam}>SUBMIT </button>
        </>
    )
}
//   ADD TEAM and Budgets





firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then((res) => {
        const user = firebase.auth().currentUser;
        return user.updateProfile({
          displayName: newUser.name
        })
      })


// SIGN UP
