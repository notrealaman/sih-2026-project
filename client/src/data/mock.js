import skills from './skills.json'
import questions from './questions.json'
import companies from './companies.json'
import academicianOpps from './academician_opportunities.json'

export function getSkills() { return skills }

export function getQuestions() {
  return questions.map(q => ({
    ...q,
    skillName: skills.find(s => s.id === q.skillId)?.name
  }))
}

export function assess(answers) {
  const scores = {}
  questions.forEach((q, i) => {
    const answer = answers[i] || 0
    const level = Math.round((answer / 3) * 100)
    const skill = skills.find(s => s.id === q.skillId)
    if (skill) scores[skill.id] = { ...skill, level }
  })
  const profile = Object.values(scores).sort((a, b) => b.level - a.level)
  return { profile, topSkills: profile.filter(s => s.level >= 66), gapSkills: profile.filter(s => s.level < 50) }
}

export function getRecommendedJobs(skillIds) {
  const allJobs = companies.flatMap(c => c.jobs.map(j => ({ ...j, company: c.name, color: c.color, logo: c.logo })))
  return allJobs.map(job => {
    const matched = job.requiredSkills.filter(s => skillIds.includes(s))
    return { ...job, matchScore: Math.round((matched.length / job.requiredSkills.length) * 100), matchedSkills: matched }
  }).sort((a, b) => b.matchScore - a.matchScore)
}

export function getRecommendedCourses(skillIds) {
  const allCourses = companies.flatMap(c => c.courses.map(co => ({ ...co, company: c.name, color: c.color })))
  return allCourses.map(course => {
    const matched = course.skills.filter(s => skillIds.includes(s))
    return { ...course, matchScore: Math.round((matched.length / course.skills.length) * 100), matchedSkills: matched }
  }).sort((a, b) => b.matchScore - a.matchScore)
}

export function getCompanies() { return companies }
export function getAcademicianOpps() { return academicianOpps }
