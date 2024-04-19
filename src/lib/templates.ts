import { format } from 'date-fns'

export const wishTemplateForNoUserPrompt = (
  recipient_name: string,
  birth_date: string,
  sender_name: string
) => {
  return `
  Write a warm and sincere birthday wish for ${recipient_name}, who is having their birthday on ${birth_date}.

  If no custom instructions are provided, please include the following in the message:

  1. A personal greeting and acknowledgement of their birthday.
  2. Express well wishes for the year ahead, such as good health, happiness, or success.
  3. Include a positive sentiment or affirmation about the person's character or your relationship with them.

  The tone should be uplifting and celebratory. Feel free to include any other relevant details or sentiments as appropriate. The final result should not contain any placeholders.

  The message should be signed by ${sender_name}. Donot include age in the message.`
}

export const wishTemplateForUserPrompt = (
  recipient_name: string,
  user_prompt: string,
  birth_date: string,
  sender_name: string
) => {
  return `
  Write a warm and sincere birthday wish for ${recipient_name}, who is having their birthday on ${birth_date}. Please follow these instructions:

  ${user_prompt}

  The tone should be uplifting and celebratory. Feel free to include any other relevant details or sentiments as appropriate. The final result should not contain any placeholders.

  The message should be signed by ${sender_name}. Donot include age in the message.`
}
