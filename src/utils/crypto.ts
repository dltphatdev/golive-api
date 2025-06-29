import bcrypt from 'bcrypt'

// Mã hóa password
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10) // cost = 10 là mức tiêu chuẩn
}

// So sánh khi login
export async function comparePassword(input: string, hash: string) {
  return await bcrypt.compare(input, hash)
}
