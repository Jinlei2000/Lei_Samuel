import { User } from 'src/users/entities/user.entity'

export const newEmployee = (user: User, url: string) => {
  return `<p>Hello ${user.firstname},</p>

<p>Welcome to the team! We're thrilled to have you on board. It's time to get started by creating your account.</p>

<p>
    <a href="${url}" style="background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;">Create Account</a>
</p>

<p>If you didn't request this email, you can safely ignore it. We're looking forward to having you on the team!</p>
`
}
