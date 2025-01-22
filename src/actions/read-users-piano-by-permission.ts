import manageTeam from '../data/manage_team_response_ec.json'

manageTeam.team_members.forEach((member) => {
  if (member.permissions.includes('manage_team')) {
    console.log(`${member.email} ${member.first_name} ${member.last_name}`)
  }
})
