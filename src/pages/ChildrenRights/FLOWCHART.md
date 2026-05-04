# ChildrenRights Decision Tree Flow Chart

## Overview
This document visualizes the navigation flow for the ChildrenRights component with actual translations.

## Legend
- 🔵 **Question Screen** - Single choice question
- 🟢 **Form Question Screen** - Form input (single or multi-select)
- 🟠 **Content Screen** - Displays content and articles
- 🔴 **Submit Screen** - Final submission screen

---

## Flow 1: Non-Emergency Flow

```
                    [non-emergency] 🔵
                    ┌──────────────────────────────┐
                    │ Non-Emergency Situations     │
                    │ Any situation that does not  │
                    │ currently endanger the life  │
                    │ or safety of the child or     │
                    │ adolescent.                  │
                    │                              │
                    │ What type of situation are   │
                    │ you seeking professional      │
                    │ services for?                │
                    └───────┬──────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
    [new]   │   [recurring-no-pro]  [recurring-pro]
            │               │               │
            │               │               │
            ▼               ▼               ▼
    [untitled-q1] 🟢  [untitled-q1] 🟢  [final-q1] 🟢
            │               │               │
            │               │               │
            ▼               ▼               ▼
    [untitled-q2] 🟢  [untitled-q2] 🟢  [final-q2] 🟢
            │               │               │
            │               │               │
            ▼               ▼               ▼
    [untitled-q3] 🟢  [untitled-q3] 🟢  [final-q3] 🟢
            │               │               │
            │               │               │
            ▼               ▼               ▼
    [untitled-q4] 🟢  [untitled-q4] 🟢  [final-q4] 🟢
            │               │               │
            │               │               │
            ▼               ▼               ▼
    [untitled-q5] 🟢  [untitled-q5] 🟢  [submit-final] 🔴
            │               │
            │               │
            ▼               ▼
    [submit-untitled] 🔴
```

### Non-Emergency Flow Details

**Entry Point:** `non-emergency` 🔵
- **Title:** "Non-Emergency Situations"
- **Paragraph:** "Any situation that does not currently endanger the life or safety of the child or adolescent."
- **Question:** "What type of situation are you seeking professional services for?"
- **Answer 1:** "A new situation, for which no professional has been contacted before" → `untitled-q1`
- **Answer 2:** "A recurring situation, for which no professional has been contacted" → `untitled-q1`
- **Answer 3:** "A recurring situation, for which a professional has already been contacted" → `final-q1`

**Untitled Flow (5 questions):**
1. `untitled-q1` 🟢 - **Question:** "What type of specialized services are you looking for?"
   - Multi-select: Specialisations (filtered: Pediatric psychiatry, Psychological assessment, Psychological counseling, Individual psychotherapy)
   - **Answer options:**
     - "Pediatric psychiatry"
     - "Psychological assessment"
     - "Psychological counseling"
     - "Individual psychotherapy"

2. `untitled-q2` 🟢 - **Question:** "In which district would you prefer the service provider to be located?"
   - Single: District (from metadata)

3. `untitled-q3` 🟢 - **Question:** "What type of service are you looking for?"
   - Single: Property Type (from metadata)
   - **Options:** Public, Private, NGO, Public-private partnership

4. `untitled-q4` 🟢 - **Question:** "What is your preferred payment method?"
   - Single: Payment Method (from metadata)
   - **Options:** Free services, Paid services, Co-payment services, Services covered by CNAS (National Health Insurance)

5. `untitled-q5` 🟢 - **Question:** "How would you prefer to work with the provider?"
   - Single: User Interaction (from metadata)
   - **Options:** In person, Online, By phone, Hybrid (combined)

6. `submit-untitled` 🔴 - Submit form

**Final Flow (4 questions):**
1. `final-q1` 🟢 - **Question:** "What services do you want the provider to offer?"
   - Multi-select: Specialisations (all available from metadata)
   - **Available services include:**
     - Pediatric psychiatry
     - Psychological assessment
     - Psychological counseling
     - Individual psychotherapy
     - Group psychotherapy
     - Support groups
     - Social work and counseling
     - Personal development
     - Vocational counseling and career guidance
     - Speech therapy
     - Occupational therapy/Ergotherapy
     - Kinetotherapy/Physiotherapy/Physical rehabilitation
     - Therapies for ASD (Autism Spectrum Disorder)
     - Disability assessment
     - Pediatric neurology
     - Special education (psychopedagogy)
     - Neuropsychomotor rehabilitation

2. `final-q2` 🟢 - **Question:** "In which district would you prefer the service provider to be located?"
   - Single: District (from metadata)

3. `final-q3` 🟢 - **Question:** "What type of service are you looking for?"
   - Single: Property Type (from metadata)

4. `final-q4` 🟢 - **Question:** "What is your preferred payment method?"
   - Single: Payment Method (from metadata)

5. `submit-final` 🔴 - Submit form

---

## Flow 2: Rights Flow

```
                    [rights-intro] 🔵
                    ┌────────────────────────────────────────────┐
                    │ The rights of children and adolescents     │
                    │ to access mental health and psychosocial   │
                    │ support services                           │
                    │                                            │
                    │ This guide helps you discover what kind   │
                    │ of support you can receive, if you need    │
                    │ it, and who can assist you — at school,    │
                    │ in the social care system, or in the       │
                    │ healthcare system.                         │
                    │                                            │
                    │ What kind of services are you interested   │
                    │ in?                                        │
                    └───────┬────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
    [schools]      [social_care]    [health_system]
            │               │               │
            ▼               ▼               ▼
    [section-2] 🔵  [section-8] 🔵  [section-11] 🔵
            │               │               │
    ┌───────┼───────┐       │       ┌───────┼───────┐
    │       │       │       │       │       │       │
    ▼       ▼       ▼       ▼       ▼       ▼       ▼
[section-3] [section-4] [section-5] [section-6] [section-7] [section-9] [section-10] [section-12] [section-13] [section-14]
   🟠         🟠         🟠         🟠         🟠         🟠         🟠          🟠          🟠          🟠
```

### Rights Flow Details

**Entry Point:** `rights-intro` 🔵
- **Title:** "The rights of children and adolescents to access mental health and psychosocial support services"
- **Paragraph:** "This guide helps you discover what kind of support you can receive, if you need it, and who can assist you — at school, in the social care system, or in the healthcare system. You will learn what services are available for children and adolescents in Romania and how you can access them."
- **Question:** "What kind of services are you interested in?"
- **Answer 1:** "Services provided in schools" → `section-2`
- **Answer 2:** "Services provided in the social care system" → `section-8`
- **Answer 3:** "Services provided in the health system" → `section-11`

**Schools Branch (`section-2`):**
- **Title:** "🏫 Services provided in schools"
- **Question:** "Would you like to know more about school-based services for:"
- **Answer 1:** "All the students" → `section-3` 🟠 (sectionNumber: 3)
- **Answer 2:** "Students receiving support levels I, II, III, or IV (Special Educational Needs)" → `section-4` 🟠 (sectionNumber: 4)
- **Answer 3:** "Pregnant students and student parents" → `section-5` 🟠 (sectionNumber: 5)
- **Answer 4:** "Students who are victims or perpetrators of violence in school" → `section-6` 🟠 (sectionNumber: 6)
- **Answer 5:** "Students sanctioned following disciplinary incidents" → `section-7` 🟠 (sectionNumber: 7)

**Content Screens - Schools:**

- **`section-3`** 🟠 (sectionNumber: 3)
  - **Title:** "🎓 Services for all students"
  - **Content:** "By law, all students benefit from psychological health monitoring through counseling services connected to school activities, ensuring their psychological well-being. Students have the right to access information, school counseling, career guidance, and psychological support to help them develop and discover their own path. Students with special educational needs (SEN) or other difficulties can receive additional, tailored support — for example, special study or assessment conditions, or even home- or hospital-based schooling if necessary. All students are also entitled to free medical, psychological, and speech therapy services through school health offices or public medical facilities. Here you can find the steps to follow in order to access psychological support services as a student: PSYCHOLOGICAL SUPPORT FOR STUDENTS IN DIFFICULT SITUATIONS"

- **`section-4`** 🟠 (sectionNumber: 4)
  - **Title:** "🧒🏻 Services provided to students with support levels I, II, III, IV (Special Educational Needs – SEN)"
  - **Content:** "Students with special educational needs (SEN) benefit from a Personalized Educational Plan (PEP), developed by specialists from the County Center for Psycho-Pedagogical Assistance. This plan is tailored to each student's individual needs and may include support for the family, psychological counseling, psycho-pedagogical assistance, learning support, specific therapies, physical therapy, or other forms of personalized support. 📘 You can find the steps to follow for obtaining the school and career guidance certificate for children with SEN here: 👉 STEPS TO OBTAIN THE SCHOOL AND VOCATIONAL ORIENTATION CERTIFICATE FOR CHILDREN WITH SPECIAL EDUCATIONAL NEEDS (SEN) 📘 You can find information about the services available for children with SEN here: 👉 SUPPORT PROVIDED BY LAW TO CHILDREN WITH SPECIAL EDUCATIONAL NEEDS (SEN)"

- **`section-5`** 🟠 (sectionNumber: 5)
  - **Title:** "👩‍🍼 Services for pregnant students and student parents"
  - **Content:** "According to Law no. 198 of July 4, 2023 on pre-university education (Article 76, paragraph 5), pregnant students and student parents are given priority access to a range of support measures aimed at preventing school dropout. These include: 🗨️ School counseling (including support from a school mediator) and 🧠 Psychological counseling. 📘 At the moment, the law does not yet have implementing regulations. Until these are published, we recommend consulting the section dedicated to services available to all students, which you can find here: 👉 PSYCHOLOGICAL SUPPORT FOR STUDENTS IN DIFFICULT SITUATIONS"

- **`section-6`** 🟠 (sectionNumber: 6)
  - **Title:** "🛑 Services for students who are victims or perpetrators of violence in school"
  - **Content:** "💔 Students who have experienced violence are entitled to state-funded psychological and psychotherapeutic intervention services, based on a recommendation from the school counselor. These services are designed to help students recover emotionally, regain their sense of safety, and reintegrate confidently into school life. 🌱 📘 Find out what types of situations are considered school violence: 👉 SITUATIONS CLASSIFIED AS SCHOOL VIOLENCE 📘 If you have been a victim of an act of violence at school, you can find below the steps you need to follow: 👉 GUIDE FOR STUDENTS WHO HAVE EXPERIENCED VIOLENCE AT SCHOOL 📘 If you have witnessed or been informed of an act of violence in school, you can find below the steps you need to follow: 👉 MANAGEMENT OF MINOR CASES OF VIOLENCE BETWEEN TODDLERS / PRESCHOOLERS / STUDENTS COMMITTED IN THE SCHOOL ENVIRONMENT 👉 link 7 – management of severe cases"

- **`section-7`** 🟠 (sectionNumber: 7)
  - **Title:** "Students disciplined after certain incidents"
  - **Content:** "Students may be disciplined if they: - destroy or alter school documents or school property; - bring in materials that promote violence, hatred, discrimination, or harm someone's reputation; - block access to the school; - possess or use drugs, alcohol, cigarettes, ethnobotanical substances, or gamble on school grounds; - bring or use weapons, firecrackers, sprays, or other dangerous objects; - distribute political, religious, obscene, or pornographic materials; - insult, discriminate, or show physical or verbal aggression; - leave the school during class hours without permission; - bring unauthorized visitors without the school administration's approval; - promote racist messages or symbols. You can find the types of sanctions here:"

**Social Care Branch (`section-8`):**
- **Title:** "🛡️ Services provided in the social care system"
- **Question:** "You want to learn more about services provided to:"
- **Answer 1:** "Minors subjected to violence by parents/caregivers or victims of domestic violence" → `section-9` 🟠 (sectionNumber: 9)
- **Answer 2:** "Minors in day care centers for children, in families and/or children separated or at risk of separation from their parents" → `section-10` 🟠 (sectionNumber: 10)
- **Answer 3:** "Minors in residential centers for children temporarily or permanently separated from their parents" → `section-10` 🟠 (sectionNumber: 10)
- **Answer 4:** "Minors in emergency reception centers for abused, neglected or exploited children" → `section-10` 🟠 (sectionNumber: 10)
- **Answer 5:** "Minors in social services with accommodation, organized as emergency centers, as well as night shelters for homeless children" → `section-10` 🟠 (sectionNumber: 10)

**Content Screens - Social Care:**

- **`section-9`** 🟠 (sectionNumber: 9)
  - **Title:** "👨🏻‍👩🏻‍👧🏻‍👦🏻 Services for minors subjected to violence"
  - **Content:** "If you want to learn more about the forms of protection provided by the social assistance and child protection services, read here:"

- **`section-10`** 🟠 (sectionNumber: 10)
  - **Title:** "🏘️ Services offered to minors in social care centers"
  - **Content:** "If you want to learn more about the services offered to minors in social assistance centers, read here:"

**Health System Branch (`section-11`):**
- **Title:** "Services provided in the health system"
- **Question:** "📚 You want to learn more about:"
- **Answer 1:** "Services for children aged 0–18, regardless of whether they are enrolled in an educational institution or not" → `section-12` 🟠 (sectionNumber: 12)
- **Answer 2:** "Underage patients with various conditions" → `section-13` 🟠 (sectionNumber: 13)
- **Answer 3:** "Underage patients with mental disorders" → `section-14` 🟠 (sectionNumber: 14)

**Content Screens - Health System:**

- **`section-12`** 🟠 (sectionNumber: 12)
  - **Title:** "Services for children aged 0–18, regardless of whether they are enrolled in an educational institution or not"
  - **Content:** "📘 If you want to learn more about the services offered to children aged 0–18, read here:"

- **`section-13`** 🟠 (sectionNumber: 13)
  - **Title:** "Services for underage patients with various conditions"
  - **Content:** "📘 If you want to learn more about the services provided to underage patients with various medical conditions, read here:"

- **`section-14`** 🟠 (sectionNumber: 14)
  - **Title:** "Services for underage patients with mental disorders"
  - **Content:** "📘 If you want to learn more about the services provided to underage patients with mental disorders, read here:"

---

## Screen Types Summary

### Question Screens 🔵
- `non-emergency` - "Non-Emergency Situations"
- `rights-intro` - "The rights of children and adolescents to access mental health and psychosocial support services"
- `section-2` - "🏫 Services provided in schools"
- `section-8` - "🛡️ Services provided in the social care system"
- `section-11` - "Services provided in the health system"

### Form Question Screens 🟢
- `untitled-q1` through `untitled-q5` - Non-emergency form flow
- `final-q1` through `final-q4` - Final form flow

### Content Screens 🟠
- `section-3` (sectionNumber: 3) - "🎓 Services for all students"
- `section-4` (sectionNumber: 4) - "🧒🏻 Services provided to students with support levels I, II, III, IV (Special Educational Needs – SEN)"
- `section-5` (sectionNumber: 5) - "👩‍🍼 Services for pregnant students and student parents"
- `section-6` (sectionNumber: 6) - "🛑 Services for students who are victims or perpetrators of violence in school"
- `section-7` (sectionNumber: 7) - "Students disciplined after certain incidents"
- `section-9` (sectionNumber: 9) - "👨🏻‍👩🏻‍👧🏻‍👦🏻 Services for minors subjected to violence"
- `section-10` (sectionNumber: 10) - "🏘️ Services offered to minors in social care centers"
- `section-12` (sectionNumber: 12) - "Services for children aged 0–18, regardless of whether they are enrolled in an educational institution or not"
- `section-13` (sectionNumber: 13) - "Services for underage patients with various conditions"
- `section-14` (sectionNumber: 14) - "Services for underage patients with mental disorders"

### Submit Screens 🔴
- `submit-untitled` - Submit form for untitled flow
- `submit-final` - Submit form for final flow

---

## Navigation Controls

- **Back Button:** Available on all screens (disabled on first screen)
- **Continue Button:** Available on question and form-question screens (enabled when answer is selected)
- **Submit Button:** Available on last form-question screen (replaces Continue button)
- **View Content Button:** Available on content screens (if sectionNumber is defined)

---

## Notes

- Content screens fetch articles based on their `sectionNumber` field matching the `decision_tree_section` field in the CMS
- Form question screens use metadata from the organization (specialisations, districts, propertyTypes, paymentMethods, userInteractions)
- All screens support back navigation through the `navigationHistory` state
- Form data is collected and submitted as query parameters to the `/organizations` page
- All user-facing text is internationalized and stored in translation files
