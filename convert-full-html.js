const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');
const TurndownService = require('turndown');

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

const articles = [
  {
    title: "President University Library Hosts HukumOnline Workshop to Strengthen Legal Research Skills",
    date: "November 19, 2025",
    desc: `On November 19, the Adam Kurniawan Library hosted a HukumOnline workshop at the Charles Himawan Auditorium to strengthen students' legal research skills. Led by Husna Syahirah Agustine from HukumOnline, the session walked participants through key platform features, search tools, and citation functions while stressing the importance of accurate legal references. The program equipped law and social science students with practical techniques for accessing regulations and verifying documents, underscoring the library's commitment to digital literacy and academic excellence...`,
    link: '/pagesNews/pages-01/content-20.html'
  },
  {
    title: "The President University Library and the Bekasi Regency Library Department held a seminar on Indonesia's Diplomacy and Heroism.",
    date: "November 20, 2025",
    desc: `On November 20 at the BI Corner of Adam Kurniawan Library, President University partnered with DISARPUS Bekasi to host a seminar on Indonesia's diplomacy and heroism on the world stage. Led by Dr. Jeanne Francoise, the session explored how historical values, national identity, and modern peacekeeping shape the country's global image. The event deepened participants' understanding of Indonesia's role in international forums and reinforced both institutions' commitment to literacy, critical thinking, and global awareness...`,
    link: '/pagesNews/pages-01/content-19.html'
  },
  {
    title: "Adam Kurniawan Library Representative Introduces Key Academic Tools in Academic Writing Classes",
    date: "November 6-7, 2025",
    desc: `On November 6-7 in Cikarang, the Adam Kurniawan Library delivered academic support sessions to Academic Writing classes across Informatics, Business Administration, and Accounting programs. Over two days, students were introduced to key digital tools and library resources aimed at improving research and writing quality. Each class received aligned guidance designed to strengthen their academic skills and help them make better use of university learning platforms...`,
    link: '/pagesNews/pages-01/content-18.html'
  },
  {
    title: "Adam Kurniawan Library Representative Highlights University E-Resources in Industrial Engineering Class Presentation",
    date: "November 3, 2025",
    desc: `On November 3 in Cikarang, the Adam Kurniawan Library visited Industrial Engineering students to walk them through the campus’ digital learning ecosystem. The session introduced key e-resources for research and coursework, highlighted how to access journals and databases, and gave practical guidance on using Turnitin responsibly. Students left with a clearer picture of where to find academic materials and how plagiarism detection supports integrity in their writing…`,
    link: '/pagesNews/pages-01/content-17.html'
  },
  {
    title: "Publish with Emerald: How to Get Publish in International Journals",
    date: "October 31, 2025",
    desc: `The Adam Kurniawan Library hosted a practical webinar on October 31, 2025, featuring Irwan Sukardi from Emerald Publishing. Lecturers and postgraduate students learned essential strategies for publishing in international journals, from manuscript development to navigating peer review. The interactive session gave participants direct access to an industry expert who addressed real publication challenges and offered actionable advice for early-career researchers looking to increase their research visibility....`,
    link: '/pagesNews/pages-01/content-16.html'
  },
  {
    title: "The library and Emerald Insight are hosting a workshop for business faculty, lecturers, and students.",
    date: "October 10, 2025",
    desc: `President University, October 10, 2025 — In collaboration with Emerald Insight, the Adam Kurniawan Library hosted an online Emerald Workshop via Google Meet for 65 participants across bachelor's, master's, and doctoral programs. The session guided attendees in using the Emerald database to find and evaluate peer-reviewed research, understand journal metrics, export citations, and integrate sources into academic writing…`,
    link: '/pagesNews/pages-01/content-15.html'
  },
  {
    title: "Library Conducts Business Economics Sessions for Management Students",
    date: "October 9, 2025",
    desc: `President University, October 7 & 9, 2025 — The Adam Kurniawan Library delivered guest lectures in Business Economics for the Management program, led by Reference Librarian Laurensius Yoel Fabian. Two sessions (≈35 students each) covered finding and evaluating credible economic and business sources, database navigation, citation tools, and applying evidence-based information to assignments—linking theory with current market data. The integration underscored the library’s role as an active partner in students’ research and analytical development…`,
    link: '/pagesNews/pages-01/content-14.html'
  },
  {
    title: "Library Joins Academic Writing Class for Business Administration Students",
    date: "October 6, 2025",
    desc: `President University, October 6, 2025 — The Adam Kurniawan Library joined an academic writing class for the 
        Business Administration program, with Reference Librarian Laurensius Yoel Fabian as guest lecturer. 
        The session guided 26 students on strategies to find, evaluate, and cite scholarly sources, 
        with hands-on demos of relevant digital databases. The initiative highlighted the library's reference services and strengthened students
         long-term research skills…`,
    link: '/pagesNews/pages-01/content-13.html'
  },
  {
    title: "Reference Librarian Introduces President University Library at PreUni Nights",
    date: "September 6, 2025",
    desc: `President University, September 6, 2025 — As part of the PreUni Nights program, the President
University Library held an online introduction session via Zoom, led by the Reference Librarian.
The event aimed to welcome and familiarize new students with the library’s facilities, services,
and digital resources. …`,
    link: "/pagesNews/pages-01/content-12.html"
  },
  {
    title: "Introducing Mendeley and Zotero to Medical Faculty Lecturers at President University",
    date: "Semptember 4, 2025",
    desc: `President University, September 4, 2025 — As part of the RINGKAS program, the President
University Library organized an online session via Zoom to introduce two powerful reference
management tools, Mendeley and Zotero, to lecturers from the Faculty of Medicine …`,
    link: "/pagesNews/pages-01/content-11.html"
  },
  // Page 1
  {
    title: "Preventing Drug Abuse Through Law and Family Seminar",
    date: "July 4, 2025",
    desc: `On Thursday, June 26, 2025, the Adam Kurniawan Library collaborated with the DISPUSIP of the Bekasi Regency 
               to hold an open seminar in commemoration of Anti-Drug Day. The seminar was titled “Preventing Drug Abuse 
               Through Law and Family.” Participants came from diverse backgrounds, including students from the Faculty of Law …`,
    link: "/pagesNews/pages-01/content-1.html"
  },

  {
    title: "Introduction to the Digital Library, OPAC, E-Resources, and Turnitin for Medical Students",
    date: "May 20, 2025",
    desc: `Faculty of Medicine, President University, May 9, 2025 — The Adam Kurniawan Library hosted a session 
               introducing students to the digital library, OPAC (Online Public Access Catalog), e-resources, and 
               Turnitin, a plagiarism-checking platform. The event took place in the Faculty of Medicine building and 
               lasted approximately one hour. It …`,
    link: "/pagesNews/pages-01/content-2.html"
  },
  {
    title: "Reformasi Limbah Beling Dari Sampah Menjadi Peluang",
    date: "February 26, 2025",
    desc: `On Monday, February 24, 2025, from 1:30 PM to 3:00 PM WIB, an event was held at the Pusat Daur Ulang 
               (Recycling Center) in Desa Mekar Mukti, Cikarang Utara, Bekasi Regency, West Java. The event was 
               collaborated Adam Kurniawan Library with President University&#39;s Center for Environment, Disaster 
               Resilience, and Sustainability (CEDRS). Approximately 40 …`,
    link: "/pagesNews/pages-01/content-3.html"
  },
  {
    title: "Technical Guidance (Bimtek): Towards Outstanding Higher Education Library Accreditation",
    date: "December 18, 2024",
    desc: `On December 10, 2024, Technical Guidance (Bimtek) Towards Universities Achieving Library Accreditation 
               was held at President University, Cikarang, starting at 09.00 to 15.00 WIB in Building A, Room A429. 
               This event brought together librarians from various universities in Bekasi city and district to discuss 
               the latest developments and strategies for …`,
    link: "/pagesNews/pages-01/content-4.html"
  },
  {
    title: "Socialization Rules and Regulations at Faculty of Medicine’s Library",
    date: "November 19, 2024",
    desc: `On November 14th, 2024 A library rules and regulations socializing event was held at the Khayangan 
               Campus of the Faculty of Medicine to acquaint students with the library policies. Key policies on library
               behavior, borrowing practices, and using digital resources like e-books and academic databases were 
               reviewed in the event that medical students …`,
    link: "/pagesNews/pages-01/content-5.html"
  },
  {
    title: "Press Reader as a Gateway to The New Automation News Paper and Magazine",
    date: "November 15, 2024",
    desc: `In an insightful Press Reader socialization held on November 5, 2024, at the Adam Kurniawan Library, 
               Mr. Bayu Setiawan as a Business Development Executive and Ms. Natasa Tjahjana as the President Director 
               from PT. Solusi Edukasi International digital media specialist explained the key features of PressReader,
               a platform offering access …`,
    link: "/pagesNews/pages-01/content-6.html"
  },
  {
    title: "Study and Explore Law Based on Technology in the Digital Era with HukumOnline",
    date: "October 31, 2024",
    desc: `On October 15, 2024, the Adam Kurniawan Library hosted an insightful seminar titled “Study and Explore 
               Law Based on Technology in the Digital Era with HukumOnline.” The event took place in the university 
               auditorium and gathered students, faculty, and legal professionals interested in the intersection of law 
               and technology. The …`,
    link: "/pagesNews/pages-01/content-7.html"
  },
  {
    title: "Encouraging Academics in Research and Learning by Utilizing Wiley E-Books.",
    date: "October 31, 2024",
    desc: `On October 10, 2024, President University hosted an informative seminar titled “Encouraging Academics in 
               Research and Learning by Utilizing Wiley E-Books.” The event took place in the university auditorium and 
               included two sessions: the first from 11:00 a.m. to 12:00 p.m. and the second from 1:00 p.m. to 2:00 p.m. …`,
    link: "/pagesNews/pages-01/content-8.html"
  },
  {
    title: "Press Reader: Growth in Global Access to Information: Bridging the Digital Divide.",
    date: "October 31, 2024",
    desc: `On October 8, 2024, the Adam Kurniawan Library hosted an enlightening seminar titled “Press Reader: 
               Growth in Global Access to Information: Bridging the Digital Divide.” This hybrid event allowed 
               participants to join either in person in Room A429 on the fourth floor or online via Google Meet. 
               The seminar began …`,
    link: "/pagesNews/pages-01/content-9.html"
  },
  {
    title: "Statista As a Gateway to Discovering Knowledge",
    date: "October 23, 2024",
    desc: `On October 4, 2024, Adam Kurniawan Library held a webinar titled “Statista As a Gateway to Discovering 
               Knowledge”, featuring keynote speaker Stephani Susilo from Statista. The event attracted students from 
               batches 2023 and 2024, who were eager to learn about the resources available through the Statista platform. 
               Stephani’s presentation highlighted …`,
    link: "/pagesNews/pages-01/content-10.html"
  },

  // Page 2 (artikel ke-7 karena 6 artikel per page)
  {
    title: "“Emerald: Innovative Approaches to Academic Learning”",
    date: "October 23, 2024",
    desc: `On September 25, 2024, the engaging webinar “Emerald: Innovative Approaches to Academic Learning” 
               featured keynote speaker Deden Ramdhani, S.Sos, an Account Executive and Product Specialist from iGroup. 
               This online event attracted a diverse audience, including students and educators keen to explore new 
               methodologies in academic learning. Deden Ramdhani’s presentation focused …`,
    link: "/pagesNews/pages-02/content-11.html"
  },
  {
    title: "The Library Team from Maranatha Christian University, Bandung, Visits the Adam Kurniawan Library at President University",
    date: "August 27, 2024",
    desc: `On Wednesday, August 14th, 2024, the library team from Maranatha Christian University 
               (Universitas Kristen Maranatha or UKM), Bandung, conducted a benchmarking visit to the Adam Kurniawan 
               Library at President University (Presuniv). The UKM team included Vice-Rector for Resources, Ir. Olga 
               Catherina Pattipawaej, MS, Ph.D., and library management personnel, such as Heriyanto, …`,
    link: "/pagesNews/pages-02/content-12.html"
  },
  {
    title: "Literacy Information Event: Breaking The Glass Ceiling!",
    date: "July 5, 2024",
    desc: `27th of June 2024, from 1 – 2.30 pm, the Adam Kurniawan Library hosted an inspiring event centered on the
               theme “Breaking the Glass Ceiling” for women’s careers. The keynote speaker, Dr. Christina Liem, 
               delivered a powerful address to an intimate audience of around 30 attendees, emphasizing the importance 
               of …`,
    link: "/pagesNews/pages-02/content-13.html"
  },
  {
    title: "The Adam Kurniawan Library, President Univ, Has Been Accredited with an A Rating by Perpustakaan Nasional",
    date: "May 31, 2024",
    desc: `The Adam Kurniawan Library at President University (Presuniv) has finally been officially accredited 
               with an A rating by the National Library of the Republic of Indonesia 
               (Perpustakaan Nasional, Republik Indonesia) after a lengthy process. certificate receipt of the 
               accreditation certificate marked this achievement in March 2024. Neilany Edwina, the Head …`,
    link: "/pagesNews/pages-02/content-14.html"
  },
  {
    title: "Information Literacy Event: Empowering Woman Through Financial Awareness",
    date: "May 2, 2024",
    desc: `The Adam Kurniawan Library held an event titled “Empowering woman through Financial Awareness” on 
               Thursday, April 25. The keynote speaker at President University are Dr. Supeni A. Mapuasari, SE, MSc.; 
               Mrs. Vita Elisa Fitriana, SE, MSc.; and Mrs. Chita Oktapriana S.Akun, M.Ak, CSRS, CMA, whose lectures on 
               banking and accounting. …`,
    link: "/pagesNews/pages-02/content-15.html"
  },

  {
    title: "HAPPY WORLD FAIRY TALE DAY",
    date: "March 21, 2024",
    desc: ``,
    image: "assets/img/news/pages-2/border-1.jpg",
    link: "pagesNews/pages-02/content-16.html"

  },
  {
    title: "Information Literacy Event: Exploring Digital Library",
    date: "May 20, 2024",
    desc: `The Adam Kurniawan Library held an event called “Exploring Digital Library.” The digital library is an 
               important facility that the library makes available to all students. This event held on-site at BI Corner
               Adam Kurniawan Library. Exploring digital libraries will help students manage their scholarly sources for
               assignments. The digital …`,
    image: "assets/img/news/pages-2/border-2.jpeg",
    link: "pagesNews/pages-02/content-17.html"
  },
  {
    title: "Information Literacy Event: Growth in Student Achievement with Salsabila Rizqina",
    date: "March 15, 2024",
    desc: `The Adam Kurniawan Library (AKL) presented an information literacy session on Wednesday, March 6th 2024 
               with Salsabila Rizqina as the keynote speaker. Salsabila Rizqina, as a student in the management study 
               program batch 2022, was chosen to share some advice about campus life hack. Salsabila is an exceptional 
               student with …`,
    image: "assets/img/news/pages-2/border-3.jpeg",
    link: "pagesNews/pages-02/content-18.html"
  },
  {
    title: "Information Literacy Event: IG Publishing Course: Exploring the Knowledge Subject Area for Academics Paper",
    date: "March 14, 2024",
    desc: `Information literacy exercises with the topic “IG Publishing Course: Exploring the Knowledge Subject 
               Area for Academics Paper” were conducted on Wednesday, February 28, at Adam Kurniawan Library (AKL). 
               In her capacity as IG Publishing Asia Pacific’s representative, Mrs. Sururin Maudhunah hosted the event. 
               The event was hosted by Fikram Maulana …`,
    image: "assets/img/news/pages-2/border-4.jpg",
    link: "pagesNews/pages-02/content-19.html"
  },
  {
    title: "Information Literacy Event: Strategy Development for Doing Paper on HukumOnline",
    date: "May 14, 2024",
    desc: `Tuesday (27/02) Adam Kurniawan Library (AKL) carried out information literacy activities with the theme 
               “Strategy Development for Doing Paper on Hukum Online”. The cooperation agreement between HOL and 
               President University, with the facilities of computers for the Hukum Online Corner at Adam Kurniawan 
               Library, and also socialization of access to …`,
    image: "assets/img/news/pages-2/border-5.jpg",
    link: "pagesNews/pages-02/content-20.html"
  },

  //     pages 3 =====================================================
  {
    title: "Information Literacy Event: Rules, Regulations & OPAC",
    date: "March 12, 2024",
    desc: `Monday, March 4, 2024The Adam Kurniawan Library hosted an event titled “Rules, Regulations & OPAC.”
               This event took place on-site at the library. Why is it important to know the rules and regulations in 
               the library? Many students have broken the rules, such as wearing shorts, bringing food into the …`,
    image: "assets/img/news/pages-3/border-6.png",
    link: "pagesNews/pages-03/content-21.html"
  },
  {
    title: "Information Literacy Event: Get to Know Library Clearance",
    date: "March 8, 2024",
    desc: `Tuesday, February 20, 2024 The Adam Kurniawan Library hosted an online event called “Get to Know Library 
               Clearance” via Google Meet. This event was created specifically for students in their final year of study 
               before graduation or students who want to drop out of their studies. Many of them are …`,
    image: "assets/img/news/pages-3/border-7.png",
    link: "pagesNews/pages-03/content-22.html"
  },
  {
    title: "Information Literacy Event: Understanding the Turnitin Similarity Report.",
    date: "March 7, 2024",
    desc: `Monday, February 12, 2024   The Adam Kurniawan Library hosted an online event titled “Understanding the 
               Turnitin Similarity Report.” This event was conducted on Google Meet. The purpose of this event is to 
               sensitize students about using Turnitin as a plagiarism checker for their writings. Usually, the 
               university has set …`,
    image: "assets/img/news/pages-3/border-8.png",
    link: "pagesNews/pages-03/content-23.html"
  },
  {
    title: "Information Literacy Event:Exploring Digital Libraries",
    date: "March 7, 2024",
    desc: `The Adam Kurniawan Library hosted an event called “Exploring Digital Libraries.” This online event aimed 
               to introduce students to the digital library, which many of them are not yet familiar with. How to access 
               online resources. The digital library is part of the online facility that allows students to access …`,
    image: "assets/img/news/pages-3/border-9.png",
    link: "pagesNews/pages-03/content-24.html"
  },
  {
    title: "Information Literacy Event: Rules and Regulation of Adam Kurniawan Library",
    date: " February 29, 2024",
    desc: `Thursday, February 1, 2024 Adam Kurniawan Library hosted an online event titled “Library Rules and 
              Regulations.” The focus of this event was on the library rules and regulations that students must follow. 
              Many students still do not know the rules and regulations of the library. For example, they come to …`,
    link: "pagesNews/pages-03/content-25.html"
  },
  {
    title: "Information Literacy Event: The Role Of Parents and Homes on Children’s Literacy Development",
    date: " February 23, 2024",
    desc: `On Tuesday (20/02) The Adam Kurniawan Library hosted a program titled “The Role of Parents and Homes on 
               Children’s Literacy Development”. Mrs. Grace Amialia Anfentonanda, S.Pd., Gr., M.Pd., a lecturer at 
               President University with a focus on teacher education and child development, be the keynote speaker. 
               This information literacy event …`,
    image: "assets/img/news/pages-3/border-10.jpeg",
    link: "pagesNews/pages-03/content-26.html"
  },

  {
    title: "SOM: SCRABBLE OF MIND",
    date: "February 1, 2024",
    desc: ``,
    image: "assets/img/news/pages-3/border-11.jpg",
    link: "pagesNews/pages-03/content-27.html"
  },
  {
    title: "HUMAN LITERACY: THE CHAMPION AND HER MOST RECENT SINGLE “KITA SESUNGGUHNYA INDONESIA”",
    date: "February 19, 2024",
    image: "assets/img/news/pages-3/border-12.jpeg",
    link: "pagesNews/pages-03/content-28.html"
  },
  {
    title: "Information Literacy Event: Mother’s Involvement in Young Children’s Literacy Development",
    date: "December 20, 2023",
    desc: `On Monday (19/12), Adam Kurniawan Library held an event titled “Mother’s Involvement in Young Children’s 
               Literacy Development”. The keynote speaker is Mrs. Pelangi Efarani, a mom of Siraj Al Din Paksi, an 
               adolescent with non-verbal autism, and Mrs. Hernawati W Retno Wiratih, S.Pd., M.Sc., MPC. This 
               information literacy event also …`,
    image: "assets/img/news/pages-3/border-13.jpg",
    link: "pagesNews/pages-03/content-29.html"
  },
  {
    title: "Information Literacy Event: Confident or Not “How Student Explain Their Confidence in Campus”",
    date: "Januari 24, 2024",
    desc: `Thursday (18/01) Adam Kurniawan Library (AKL) held an information literacy event with the theme 
               “Confident or Not: How Students Explain Their Confidence on Campus”. An excellent source of advice on 
               courage and how to accomplish goals with amazing confidence was Adam Kurniawan, Library Ambassador.
               Students from different batch of President …`,
    image: "assets/img/news/pages-3/border-14.png",
    link: "pagesNews/pages-03/content-30.html"
  },
  //     Pages 4 ==================================================================
  {
    title: "Information Literacy Event: Financial Literacy and Economy, What College Students Need to Know",
    date: "Desember 20, 2023",
    desc: `On Thursday, 14 December 2023, Adam Kurniawan Library (AKL) held a seminar with the topic “Financial 
               Literacy and Economy, What College Students Need to Know”. The keynote speaker is Mr. Dr. Muhamad Safiq, 
               S.E., M.Si., Ak., CA. and Mr. Andrianantenaina Hajanirina, B.A., B.Sc., M.M, both of them is a Lecturer …`,
    image: "assets/img/news/pages-4/border-16.jpg",
    link: "pagesNews/pages-04/content-31.html"
  },
  {
    title: "Election of Adam Kurniawan Library Ambassador 2023",
    date: "December 20, 2023",
    desc: `Adam Kurniawan Library conducted activities to select library ambassadors as one of its promotional 
               initiatives for patrons, especially students at President University. The selection procedure for 
               applicants chosen from each major was held from October until November 2023 by the library. On November 
               29, 2023, Shafa Aulia Sabrina, a student …`,
    image: "assets/img/news/pages-4/border-17.jpg",
    link: "pagesNews/pages-04/content-32.html"
  },
  {
    title: "SOM : SCRABBLE OF MIND BY ADINDA ISYA HANDY PUTRI",
    date: "November 22, 2023",
    desc: ``,
    image: "assets/img/news/pages-4/border-18.jpeg",
    link: "pagesNews/pages-04/content-33.html"
  },
  {
    title: "Information Literacy Event: Reflection on National Heroes Day Commemoration, Gen Z, and Literacy",
    date: "November 24, 2023",
    desc: `On Tuesday (07/11), Adam Kurniawan Library held an event in collaboration with Dinas Perpustakaan dan 
               Kearsipan Pemerintah Daerah Kabupaten Bekasi, West Java, titled “Reflection on National Heroes Day 
               Commemoration, Gen Z and Literacy”. The keynote speaker is Mr. Dr. Ir. Robert Pangihutan Radjagoekgoek, 
               S.Sos., S.H., M.H., CLL., CLA., a Lecturer …`,
    image: "assets/img/news/pages-4/border-19.jpg",
    link: "pagesNews/pages-04/content-34.html"
  },
  {
    title: "HUMAN LITERACY : A JOURNEY OF DEDICATION AND GROWTH FOR CHARLENE FELICIA",
    date: "November 20, 2023",
    desc: ``,
    image: "assets/img/news/pages-4/border-20.jpeg",
    link: "pagesNews/pages-04/content-35.html"
  },
  {
    title: "Adam Kurniawan Library Enters Top 5 Academic Library Innovation Awards",
    date: "November 10, 2023",
    desc: `(Tuesday, 10/11) The 2023 Academic Library Innovation Award (ALIA) and Indonesian Academic Librarian 
               Award (IALA) Competition was held by the Indonesian Higher Education Library Forum (FPPTI) West Java 
               Region at the UPI Library. The main theme is “Upscaling Academic Library Resources as a Strategy to 
               Navigate the Post-Pandemic Era, Digital …`,
    link: "pagesNews/pages-04/content-36.html"
  },
  {
    title: "Information Literacy Event: Adam Kurniawan Library X Komite President Special Needs Center",
    date: "October 27, 2023",
    desc: `Understanding and Preventing Childhood Infectious Diseases On Friday (15/09), Adam Kurniawan Library in 
               cooperation with Komite President Special Needs Center held an event titled “Mengenal dan Mencegah 
               Penyakit Menular Pada Anak”. The keynote speaker is Dr. Sita Ariyani Sp.A., an expert in social 
               pediatrics. The purpose of this information event `,
    link: "pagesNews/pages-04/content-37.html"
  },
  {
    title: "Information Literacy Event: The Strategy for Submitting Your Article to an International Journal",
    date: " August 15, 2023",
    desc: `On Thursday, 10 August 2023, Adam Kurniawan Library (AKL) held a webinar with the topic “The Strategy 
               for Submitting Your Article to an International Journal”. This event was a collaboration between 
               President University and Emerald Publishing. The purpose of this webinar was to give participants the 
               strategies for submitting articles …`,
    link: "pagesNews/pages-04/content-38.html"
  },
  {
    title: "Information Literacy Event : Guarding Each Other from Sexual Harassment, Bullying and Cyber Hoax in Campus",
    date: "August 7, 2023",
    desc: `“Be kind to everyone.” This is one of the keys to stop bullying as conveyed by Gia Raharja in 
               Adam Kurniawan Library (AKL) Information Literacy Event on Tuesday, 18 July 2023. In collaboration with 
               Saling Jaga Indonesia, the event was raised the theme “Guarding Each Other from Sexual Harassment, Bullying …`,
    image: "assets/img/news/pages-4/border-21.png",
    link: "pagesNews/pages-04/content-39.html"
  },
  {
    title: "Information Literacy Event: Bilingualism and Children’s Cognitive Development",
    date: "August 4, 2023",
    desc: `On Tuesday (25/07), Adam Kurniawan Library held an event in collaboration with Dinas Perpustakaan dan 
              Kearsipan Kabupaten Bekasi, West Java, titled “Information Literacy: Bilingualism and Children’s Cognitive 
              Development”. The keynote speaker is Mrs. Disa Evawani Lestari, S.S., M.Sc. a Lecture at President University 
              and an expert in English subjects which …`,
    image: "assets/img/news/pages-4/border-22.png",
    link: "pagesNews/pages-04/content-40.html"
  },
  //     pages 5 ============================================================================
  {
    title: "Information Literacy Event: How to Apply for Your Library Clearance",
    date: "July 13, 2023",
    desc: `The Adam Kurniawan Library (AKL) held an online event with the topic “How to Apply for Your Library 
               Clearance” on Wednesday, 5 July 2023. This event was part of AKL’s commitment to spreading information 
               literacy to its users, especially President University (PresUniv) students. Library clearance is an 
               important point for …`,
    image: "assets/img/news/pages-5/border-23.jpg",
    link: "pagesNews/pages-05/content-41.html"
  },
  {
    title: "Library in Action: Transforming The Librarian: Issues, Challenges, and Prospects",
    date: "June 21, 2023",
    desc: `On Tuesday (06/06), as a follow-up to the joint agreement between the Bekasi Regency Government and 
              President University No. 018/PU/DN/IV/2022 concerning the Development of an Academic Health System. Adam 
              Kurniawan Library collaborated with the Bekasi Regency Government Archives and Library Office to improve 
              the culture of literacy in the community …`,
    image: "assets/img/news/pages-5/border-24.jpg",
    link: "pagesNews/pages-05/content-42.html"
  },
  {
    title: "Pancasila will Never Fade: an Information Literacy Event of Adam Kurniawan Library President University.",
    date: "June 15, 2023",
    desc: `“Pancasila will Never Fade”, that was the tagline from a forum conducted on Monday, 12 June 2023 at B.I. 
                Corner of Adam Kurniawan Library President University. The topic “Strengthening Pancasila and National 
                Spirit in the Digital Age” was presented by Dr. Andreas Yumarma, a lecturer and student consultant of 
                President …`,
    image: "assets/img/news/pages-5/border-25.png",
    link: "pagesNews/pages-05/content-43.html"
  },
  {
    title: "Information Literacy Event: User Training How to Access Emerald Journal",
    date: "June 9, 2023",
    desc: `On Wednesday (24/05), Adam Kurniawan Library held an event in association with Emerald Publishing titled 
               “User Training How to Access Emerald Journal”. The speaker is Mr. Irwan Sukardi as Business Manager, 
               Emerald Publishing. Adam Kurniawan Library organizes a Webinar for all students, lecturers, and also 
               staff members. The purpose of …`,
    image: "assets/img/news/pages-5/border-26.jpg",
    link: "pagesNews/pages-05/content-44.html"
  },
  {
    title: "Information Literacy Event : Improving Health Literacy to Prevent Stunting",
    date: "June 9, 2023",
    desc: `On Thursday (23/05), Adam Kurniawan Library held an event in collaboration with Dinas Perpustakaan dan 
               Kearsipan Kabupaten Bekasi, West Java, titled 
               “Information Literacy: Improving Health Literacy to Prevent Stunting”. The keynote speaker is 
               Mr. Haris Herdiasnyah a Lecture at President University and an expert in Communication and 
               Clinical Psychologist. This …`,
    image: "assets/img/news/pages-5/border-27.png",
    link: "pagesNews/pages-05/content-45.html"
  },
  {
    title: "Announcement : Adam Kurniawan Library Opening Hours",
    date: "May 28, 2023",
    desc: `[ANNOUNCEMENT] Dear Presunivers,We would like to inform you, starting from 29th May 2023,Monday until 
               FridayAdam Kurniawan Library will be open at 08.00 A.M until 08.30 P.M.Please come and visit us, 
               Best Regards,Librarian`,
    image: "assets/img/news/pages-5/border-28.png",
    link: "pagesNews/pages-05/content-46.html"
  },
  {
    title: "Event for the Public: Mental Health Conference and Expo",
    date: "April 12, 2023",
    desc: `On Thursday (06/04), Adam Kurniawan Library held an event in collaboration with LAW students class of 
               2022 President University entitled “Mental Health Conference and Expo”. The keynote speakers were Ms. 
               Zenny Rezania Dewantary the founder of SalingJaga.id, Ms. Dinda Chairsha as the Chair of the Indonesian 
               Mental Health Ambassador, and …`,
    link: "pagesNews/pages-05/content-47.html"
  },
  {
    title: "Adam Kurniawan Library Exhibition Week",
    date: "March 24, 2023",
    desc: `On Monday (13/03), Adam Kurniawan Library held an exhibition collaboration with Visual Communication 
              Design Students, Interior Design Students, and Shutter Club.  This event was held from 13 2023 until 
              March 21, 2023. Various projects are displayed and can be enjoyed by students. These events were an 
              implementation the function of …`,
    image: "assets/img/news/pages-5/border-29.png",
    link: "pagesNews/pages-05/content-48.html"
  },
  {
    title: "Adam Kurniawan Library X IG Publishing : Training and Assistance E-Books Access for Your Paper",
    date: " March 24, 2023",
    desc: `On Wednesday (15/03), Adam Kurniawan Library held an event titled “Training and Assistance E-Books 
               Access for Your Paper” for the students of President University at Charles Himawan Auditorium. 
               Mr. Deden Ramdhani from iGroup came to the event as an expert to train the students on how to use 
               IG Library. …`,
    image: "assets/img/news/pages-5/border-30.png",
    link: "pagesNews/pages-05/content-49.html"
  },
  {
    title: "Information Literacy Event : Digital Literacy and Effective Use of Social Media",
    date: "March 24, 2024",
    desc: `On Wednesday (22/02), Adam Kurniawan Library in cooperation with Dinas Perpustakaan dan Kearsipan 
               Kabupaten Bekasi held a public event entitled “Digital Literacy and Effective Use of Social Media”. 
               Ms. Anathasia Citra as the speaker gives a lot of information about how to behave on social media.  
               “It’s not the truck …`,
    image: "assets/img/news/pages-5/border-31.png",
    link: "pagesNews/pages-05/content-50.html"
  },
  //     pages 6 ============================================================================
  {
    title: "Hukum Online: How Easily Find the Results You are Looking for",
    date: "February 23, 2023",
    desc: `On Thursday (09/02), Adam Kurniawan Library held an event titled “Hukum Online: How Easily Find the 
               Results You are Looking for” for the President University students in room A429. Adam Kurniawan Library 
               now subscribes to Hukum Online starting from January until December 2023. Miss Annisa from Hukum Online 
               came as …`,
    image: "assets/img/news/pages-6/border-32.png",
    link: "pagesNews/pages-06/content-51.html"
  },
  {
    title: "Rector Decree Number 4 of 2023 Library Clearance",
    date: "February 13, 2023",
    desc: `Dear Presunivers, We would like to remind you that in order to join the graduation this year, you need to
               request and complete the Judicium Clearance. Based on Rector Decree Number 4 of 2023 requirement for 
               Judicium, regarding the Library Clearance students obligated comply with all requirements.  
               For more information, …`,
    image: "assets/img/news/pages-6/border-33.png",
    link: "pagesNews/pages-06/content-52.html"
  },
  {
    title: "Public Seminar: The Mother’s Role to Increase Family Literacy",
    date: " January 19, 2023",
    desc: `On Tuesday (20/12), Adam Kurniawan Library in cooperation with Dinas Perpustakaan dan Kearsipan Kabupaten
               Bekasi held a public event entitled “The role of mothers in increasing family literacy”. Ms Grace Amin as 
               the speaker gives a lot of information about the role of mothers to increase family literacy and parenting …`,
    image: "assets/img/news/pages-6/border-34.png",
    link: "pagesNews/pages-06/content-53.html"
  },
  {
    title: "Webinar on Academic Writing: Strategies to Achieve International Research Publications",
    date: "December 8, 2022",
    desc: `On Tuesday (15/11), Adam Kurniawan Library held an event titled “Webinar on Academic Writing: Strategies 
               to Achieve International Research Publications” for academic civitas of President University and Public. 
               Ms. Mabel Tang from Springer Nature came as an expert in the event giving training to the participants 
               on how to use …`,
    image: "assets/img/news/pages-6/border-35.png",
    link: "pagesNews/pages-06/content-54.html"
  },
  {
    title: "Information Literacy Agenda: Literacy for Culture and Historical Narratives.",
    date: "December 1, 2022",
    desc: `On Thursday (10/11), Adam Kurniawan Library held an event titled “Literacy Information: Literacy for 
               Culture and Historical Narratives” for the President University students in the B. I. 
               Corner Adam Kurniawan Library. Dr. Jeanne Francoise, The First Doctor of Defense Heritage in 
               Indonesia came as the speaker at the event to …`,
    image: "assets/img/news/pages-6/border-36.jpg",
    link: "pagesNews/pages-06/content-55.html"
  },
  {
    title: "Library in Action!",
    date: " December 1, 2022",
    desc: `SMA Terang Bangsa Cirebon paid a visit to the Adam Kurniawan library on Thursday, 
               November 10, 2022. The visit was meant for the students to know the types of library services and 
               facilities. They also got information about literacy activities that are being carried out in 
               Adam Kurniawan Library. (Anindya/Librarian, …`,
    image: "assets/img/news/pages-6/border-37.jpg",
    link: "pagesNews/pages-06/content-56.html"
  },
  {
    title: "Information Literacy Agenda: How to Find the Best Journal for My Paper",
    date: "December 1, 2022",
    desc: `On Monday (07/11), Adam Kurniawan Library held an event titled “Literacy Information: How to Find Best 
               Journal for My Paper” for the President University students in the B. I. Corner Adam Kurniawan Library. 
               Mr. Ihsan Hadiansah came as the speaker at the event to share how to start doing research …`,
    image: "assets/img/news/pages-6/border-38.jpg",
    link: "pagesNews/pages-06/content-57.html"
  },
  {
    title: "Information Literacy: See The World with IISMA Scholarship",
    date: "November 7, 2022",
    desc: `On Wednesday (26/10), Adam Kurniawan Library held an Information Literacy Event “See The World with 
               IISMA Scholarship” with Ahda Ayudia Hairisa as the IISMA Awardee to the University of Limerick Ireland 
               2021, and Kadek Astri Dwijayanti as the IISMA Awardee to the University of Warsaw Poland 2021 came as 
               the …`,
    image: "assets/img/news/pages-6/border-39.jpg",
    link: "pagesNews/pages-06/content-58.html"
  },
  {
    title: "Information Literacy Agenda: Learning As A Self-Risk Investment",
    date: "November 7, 2022",
    desc: `On Tuesday (18/10), Adam Kurniawan Library held an event titled “Literacy Information: Learning As a 
               Self-Risk Investment” for the President University students in the B. I. Corner. Mr. Haris Herdiansyah, 
               S.Psi, M.Si. was the speaker at the event and talked about transforming ourselves to be more credible 
               and successful. The …`,
    image: "assets/img/news/pages-6/border-40.jpg",
    link: "pagesNews/pages-06/content-59.html"
  },
  {
    title: "Book Review Event: Think Big, Start Small, Move Fast Written By The Founder of President University",
    date: "November 1, 2022",
    desc: `On Wednesday (28/09), Book Review “Think Big, Start Small, Move Fast” written by the Founder of 
               President University was held in the Adam Kurniawan Library. The event began started 
               from 16.00 until 17.00 WIB. The speaker were Mrs. Neilany Edwina Nulampau, S.Sos., M.Si., and 
               Dr. Ir. Yunita Ismail Masjud, M.Si. …`,
    image: "assets/img/news/pages-6/border-41.jpg",
    link: "pagesNews/pages-06/content-60.html"
  },
  // pages 7 ======================================================================

  {
    title: "Information Literacy Agenda Writing Papers and Ethics in Publishing",
    date: " October 21, 2022",
    desc: `On Wednesday (12/10), Adam Kurniawan Library held an event titled “Literacy Information: Writing Papers 
               and Ethics in Publishing” for the President University students in the B. I. 
               Corner Adam Kurniawan Library. Dr. Jeanne Francoise, The First Doctor of Defense Heritage in 
               Indonesia came as a speaker at the event given …`,
    image: "assets/img/news/pages-7/border-42.jpg",
    link: "pagesNews/pages-07/content-61.html"
  },

  {
    title: "Information Literacy Agenda “Get to Know Reference Services: Try, True, New”",
    date: " October 21, 2022",
    desc: `On Wednesday (28/09 and 05/10), Adam Kurniawan Library held an Information Literacy Event titled “Get to 
               Know Reference Services: Try, True, New” for the President University students in B.I Corner with 
               Mr. David Maraharja Manullang, M.M. as the speaker. The event was used to inform the students regarding 
               the reference …`,
    image: "assets/img/news/pages-7/border-43.png",
    link: "pagesNews/pages-07/content-62.html"
  },

  {
    title: "Information Literacy Agenda: Improving your Writing Skills",
    date: " September 29, 2022",
    desc: `On Thursday (21/09), Adam Kurniawan Library held an event titled “Literacy Information: Improving Your 
               Writing Skills” for the President University students in the B. I. Corner Adam Kurniawan Library. 
               Mr. Jazak Yus Afriansyah, S.E., M.M., an author, coach, and trainer came as a speaker at the event giving 
               coaching to …`,
    image: "assets/img/news/pages-7/border-44.jpg",
    link: "pagesNews/pages-07/content-63.html"
  },
  {
    title: "Adam Kurniawan’s Library Training Event",
    date: " September 22, 2022",
    desc: `On Thursday (15/09), Adam Kurniawan Library held an event titled “How to Use Springer Journal” for the 
               President University students in Charles Himawan Auditorium. Mr. Deden Ramdhani from the iGroup came as 
               an expert in the event giving training to the students on how to use Springer. The event was …`,
    image: "assets/img/news/pages-7/border-45.jpg",
    link: "pagesNews/pages-07/content-64.html"
  },
  {
    title: "Training Springer Journal with an expert",
    date: " September 9, 2022",
    desc: `Hi Presunivers,We would like to inform you that President University provides an opportunity for “Training
               Springer Journal with an expert”.The event will be held on:Date/Time : 15th September 2022 /@ 
               10:00 AM – 11:00 AM & @ 02.00 PM – 03.00 PM (Please Choose one)Place : Charles Himawan AuditoriumPlease …`,
    image: "assets/img/news/pages-7/border-46.jpg",
    link: "pagesNews/pages-07/content-65.html"
  },
  {
    title: "PreUni: Library Tour",
    date: " September 5, 2022",
    desc: `On Monday (29/08), Anindya Ambar Wati, S.S.I., M.Hum., a staff of Adam Kurniawan Library delivered an 
               orientation related to library services for the new students in the Pre-Uni event. There was also a 
               library tour that the students attended in which they were introduced to Adam Kurniawan’s facilities and 
               collection …`,
    image: "assets/img/news/pages-7/border-47.jpg",
    link: "pagesNews/pages-07/content-66.html"
  },
  {
    title: "Library is Open on Saturday",
    date: " September 2, 2022",
    desc: `We would like to inform in September 2022, Adam Kurniawan Library is Open on 
               Saturday at 09.00 A.M – 03.00 P.M.Please come and visit us,Best Regards,`,
    image: "assets/img/news/pages-7/border-48.jpg",
    link: "pagesNews/pages-07/content-67.html"
  },
  {
    title: "Information Literacy Event: How to Apply for Library Clearance",
    date: " July 29, 2022",
    desc: `On Wednesday (20/7)/Monday (25/7) (01/8), Adam Kurniawan Library held an information literacy event about 
               the process of library clearance at President University. The event was held from 09.00 until 10.00 AM 
               with Mr. Alfonsus Oki Tindarana, S.Hum as the speaker. The event was conducted both offline (20/7) 
               and online (25/7)(01/8). …`,
    image: "assets/img/news/pages-7/border-49.jpg",
    link: "pagesNews/pages-07/content-68.html"
  },
  {
    title: "Literacy Information Event for President University Students",
    date: " July 15, 2022",
    desc: ` On Tuesday (05/07 and 12/07), Adam Kurniawan Library held an event titled Literacy Information for the 
                President University students in B. I Corner. The event was used to inform the students regarding the 
                services and facilities that can be provided to support the learning process and the completion of studies. …`,
    image: "assets/img/news/pages-7/border-50.jpg",
    link: "pagesNews/pages-07/content-69.html"
  },
  {
    title: "Collaboration News: Adam Kurniawan Library in Action!",
    date: "July 14, 2022\n",
    desc: `On Tuesday (21/06), as a follow-up to the mutual agreement between the Bekasi Regency Government and 
               President University No 018/PU/DN/IV/2022 regarding the Development of the Academic Health System, 
               The Head of Adam Kurniawan Library, Neilany Edwina Nulampau, S.Sos., M.Si. and her staffs, 
               David Maraharja Manullang, S. Hum. and Anindya Ambar …`,
    image: "assets/img/news/pages-7/border-51.jpg",
    link: "pagesNews/pages-07/content-70.html"
  },

  //     Pages 8 ==================================================================================================
  {
    title: "Book Donation Requirement",
    date: "June 9, 2022",
    desc: `We would to tell you the requirement for book donation. 1. The Book must be new and original one 
               (minimum of one exemplar)2. The book must be student’s major-related3. The book can be in English or 
               Indonesian language4. The publication year must be within the last three years5. Student must …`,
    image: "assets/img/news/pages-8/border-52.png",
    link: "pagesNews/pages-08/content-71.html"
  },
  {
    title: "Library Clearance Guide",
    date: "June 9, 2022",
    desc: `We would to share the guideline for library clearance process.1. Student give the CD thesis to library 
               staff2. Student give donation book3. Librarian check student book donation and CD thesis4. Librarian 
               check student’s book borrowing and fine5. Librarian do checklist student PUIS6.Librarian give student 
               library clearance`,
    image: "assets/img/news/pages-8/border-53.png",
    link: "pagesNews/pages-08/content-72.html"
  },
  {
    title: "Procedure for Sending CD Thesis",
    date: " June 8, 2022",
    desc: `Hi Presunivers,In order to have the library clearance, student have to submit the final thesis to library.
               Please follow these steps:1. Student write the final thesis2. Student download additional document from 
               https://bit.ly/LibraryClearance3. Student fill the additional document and combine the final thesis into 
               one file (PDF)4. Student send email to : …`,
    image: "assets/img/news/pages-8/border-54.jpg",
    link: "pagesNews/pages-08/content-73.html"
  },
  {
    title: "Turnitin Check Procedure",
    date: " June 8, 2022",
    desc: `Hi Presunivers,Adam Kurniawan Library provides Turnitin similarity checking for President University 
               academics.Please send your article files in word/pdf format to:library.turnitin@president.ac.id`,
    image: "assets/img/news/pages-8/border-55.png",
    link: "pagesNews/pages-08/content-74.html"
  },
  {
    title: "How to Extend the Book in Adam Kurniawan?",
    date: " June 6, 2022",
    desc: `Hi Presunivers, Do you know how to extend the book in Adam Kurniawan Library??? We would like to help you,
               so you will not be confused anymore. Please kindly pay attention. Best Regards`,
    image: "assets/img/news/pages-8/border-56.png",
    link: "pagesNews/pages-08/content-75.html"
  },
  {
    title: "How to Return the Book in Adam Kurniawan Library",
    date: " June 6, 2022",
    desc: `Hi Presunivers,If you want to know “How to return the book in Adam Kurniawan Library”Please, read this post. 
                So, you are not late returning the book.Best Regards,`,
    image: "assets/img/news/pages-8/border-57.jpg",
    link: "pagesNews/pages-08/content-76.html"
  },
  {
    title: "How to Borrow the Book in Adam Kurniawan Library",
    date: "May 30, 2022",
    desc: `Hi Presunivers,Do you know how to borrow the book in Adam Kurniawan Library???If you said ” I don’t 
               know”We would like to help you, so you will not be confused anymore.Please kindly pay attention.`,
    image: "assets/img/news/pages-8/border-59.jpg",
    link: "pagesNews/pages-08/content-77.html"
  },
  {
    title: "New Opening Hours",
    date: " May 27, 2022",
    desc: `As our support for offline learning activities in President University. Which will be starting @ 30 May 
               2022.Therefore, Adam Kurniawan would to inform new opening hours. Please check our new post.Please keep 
               #5M when visiting library.Best Regards,`,
    image: "assets/img/news/pages-8/border-58.jpg",
    link: "pagesNews/pages-08/content-78.html"
  },

  {
    title: "Story Telling Competition 2022",
    date: " March 9, 2022",
    desc: `Hi Presunivers! How are you today? Hope you’re doing great! We are from Adam Kurniawan Library 
               collaborated with Primary School Teacher Education President University and PUMA PSTE 2022. We proudly 
               announce that registration for Story Telling Competition is finally opened!This competition will held 
               by Adam Kurniawan Library President University. Participants Primary School Teacher Education …`,
    // image: "assets/img/news/pages-7/border-51.jpg",
    link: "pagesNews/pages-08/content-79.html"
  },
  {
    title: "Webinar Refleksi 24 Tahun Pasca Reformasi: Tantangan untuk Generasi Muda",
    date: " May 18, 2022",
    desc: `Sudah 24 tahun lalu kita hidup di alam Reformasi. Dalam perjalanan waktu ini, saatnya kita berefleksi: 
               bagaimana generasi muda menyikapi momen bersejarah ini? Apa peran yang dapat diambil oleh generasi muda 
               di masa Reformasi? Bagaimana generasi muda, khususnya mahasiswa mengantisipasi tantangan terhadap 
               cita-cita Reformasi?Adam Kurniawan Library mengundang para mahasiswa untuk …`,
    image: "assets/img/news/pages-8/border-60.jpg",
    link: "pagesNews/pages-08/content-80.html"
  },
  //     Pages 9 =========================================================================
  {
    title: "Library Open For Public",
    date: " January 17, 2022",
    desc: ` President University Adam Kurniawan Library gladly announced that we are now currently 
                open for the public, you may visit and borrow your favorite books. Our operational hour are from 09.00 
                until 16.00, See you.. and do not forget to use your mask and keep your distance, because we care about 
                …`,
    // image: "assets/img/news/pages-9/border-.jpg",
    link: "pagesNews/pages-09/content-81.html"
  },
  {
    title: "Library Stock Opname",
    date: " January 10, 2022",
    desc: ``,
    // image: "assets/img/news/pages-9/border-.jpg",
    link: "pagesNews/pages-09/content-82.html"
  },
  {
    title: "Digital Collections of National Library",
    date: " November 26, 2021",
    desc: `In accordance with the circular letter of the head of the National Library of Indonesia, 
               Adam Kurniawan’s library would like to inform you that as the academic community members of the 
               President’s University, we are granted access by the National Library to explore the digital collections,
                namely:   1. iPusnas, …`,
    // image: "assets/img/news/pages-9/border-.jpg",
    link: "pagesNews/pages-09/content-83.html"
  },
  {
    title: "Digital Collections of National Library (2)",
    date: "November 26, 2021",
    desc: `  In accordance with the circular letter of the head of the National Library of Indonesia, 
        Adam Kurniawan’s library would like to inform you that as the academic community members of the President 
        University, we are granted access by the National Library to explore the digital collections, namely:   1. …`,
    // image: "assets/img/news/pages-9/border-.jpg",
    link: "pagesNews/pages-09/content-84.html"
  },
  {
    title: "Access E-Journal from Home",
    date: " September 24, 2021",
    desc: `Hello Presunivers and Researchers of President University, You can access e-Journals using Springer, 
               especially during online lectures and research activities from home like today. Adam Kurniawan Library 
               will inform you how to use the Springer website. The Springer website will help Presunivers to be able 
               to access scientific references in …`,
    image: "assets/img/news/pages-9/border-61.jpeg",
    link: "pagesNews/pages-09/content-85.html"
  },
  {
    title: "Special Trial Access",
    date: " November 17, 2021",
    desc: `Adam Kurniawan library would inform you about the special trial access. This journal database is 
               ASME (The American Society Mechanical Engineers).ASME journal program has used rigorous, peer-reviewed 
               vetting, to publish the highest quality research and make it available to engineering, professionals 
               looking to change the world.We Hope this journal database …`,
    // image: "assets/img/news/pages-9/border-.jpg",
    link: "pagesNews/pages-09/content-86.html"
  },
  {
    title: "NATIONAL STANDARDIZATION AGENCY OF INDONESIA",
    date: "August 24, 2021",
    desc: `Provided access to documents of standardization national of Indonesia (SNI) for the public through 
               services:  1. Free access of SNI full text through  https://akses-sni.bsn.go.id/ *except for identical 
               adoption SNI of foreign standard/international in term of publication copyright 2. Free Download the 
               newest SNI through SISPK http://sispk.bsn.go.id/  *valid for one year …`,
    // image: "assets/img/news/pages-9/border-.jpg",
    link: "pagesNews/pages-09/content-87.html"
  },
  {
    title: "Library Closed",
    date: " August 26, 2021",
    desc: `To support the government’s program to reduce the positive number of COVID, the Adam Kurniawan Library 
               will be temporarily closed, starting August 23-30-2021While the venue is closed, Presunivers can access 
               the library collection via the website https://opac.president.ac.id/ , http://repository.president.ac.id/
                and https://link.springer.com/  If you need an e-book or e-journal, you can send …`,
    image: "assets/img/news/pages-9/border-62.png",
    link: "pagesNews/pages-09/content-88.html"
  },
  {
    title: "Library Closed",
    date: " August 6, 2021",
    desc: `To support the government’s program to reduce the positive number of COVID, the Adam Kurniawan Library 
               will be temporarily closed, starting August 2-16-2021While the venue is closed, Presuniv can access the 
               library collection via the websitehttps://opac.president.ac.id/ , http://repository.president.ac.id/ and 
               https://link.springer.com/If you need an e-book or e-journal, you can send an …`,
    image: "assets/img/news/pages-9/border-63.png",
    link: "pagesNews/pages-09/content-89.html"
  },
  {
    title: "Access E-Journal & E-Books from Home",
    date: " August 24, 2021",
    desc: `Hello Presunivers and Researchers of President University, Presunivers can access E-Journals and other 
               online resources using ANU Press, especially during online lectures and research activities from home 
               like today.   Adam Kurniawan Library will inform you how to use ANU Press, which will later help 
               Presunivers to access scientific references …`,
    image: "assets/img/news/pages-9/border-64.jpeg",
    link: "pagesNews/pages-09/content-90.html"
  },
  //     Pages 10 =========================================================================

  {
    title: "Library Closed",
    date: " July 23, 2021",
    desc: `To support the government’s program to reduce the positive number of COVID, the Adam Kurniawan Library 
               will be temporarily closed, starting July 21-31 2021 While the venue is closed, Presuniv can access the 
               library collection via the website https://opac.president.ac.id/ , http://repository.president.ac.id/ 
               and https://link.springer.com/ If you need an e-book or e-journal, …`,
    image: "assets/img/news/pages-10/border-65.jpeg",
    link: "pagesNews/pages-10/content-91.html"
  },
  {
    title: "Library Clearance",
    date: " July 23, 2021",
    desc: `We hereby inform you that starting July 23, 2021 for students who have completed their studies and need a
               Library Clearance Letter but have not submitted their CD to the library, they can send a thesis soft file 
               in pdf form to email library.cdthesis@president.ac.id with format file name Thesis_Fullname_Student ID …`,
    image: "assets/img/news/pages-10/border-66.jpeg",
    link: "pagesNews/pages-10/content-92.html"
  },
  {
    title: "Koleksi digital Perpustakaan Nasional RI",
    date: " June 4, 2021",
    desc: `Dalam rangka meneruskan surat edaran kepala Perpustakaan Nasional RI. Maka perpustakaan Adam Kurniawan 
               bermaksud memberitahukan kepada seluruh sivitas akademik Universitas Presiden, bahwa Perpustakaan Nasional 
               mempunyai koleksi digital yang dapat di akses oleh pemustaka dengan aplikasi online yaitu: 1.            
               iPusnas, berisikan e-book terbitan dalam negeri full-text yang dapat diakses secara gratis …`,
    image: "assets/img/news/pages-10/border-67.png",
    link: "pagesNews/pages-10/content-93.html"
  },
  {
    title: "Perpustakaan Tutup Sementara",
    date: "June 22, 2021",
    desc: `Penutupan Layanan On-site Adam Kurniawan Library mulai 23 Juni – 2 July 2021. Adam Kurniawan Library 
               mendukung tindakan pemerintah RI untuk mengurangi persebaran virus Covid-19. Juga mengikuti arahan 
               Inter-Office Memo dari Pimpinan President University berkaitan dengan kenaikan kasus covid-19 di kawasan 
               President University, oleh karena itu layanan on-site Adam Kurniawan …`,
    image: "assets/img/news/pages-10/border-68.png",
    link: "pagesNews/pages-10/content-94.html"
  },
  {
    title: "Similarity Turnitin Check Service",
    date: " April 22, 2021",
    desc: `Adam Kurniawan Library provides Turnitin similarity checking for President University academics. Please 
               send your article files in word/pdf format to library.turnitin@president.ac.idThank you.`,
    link: "pagesNews/pages-10/content-95.html"
  },
  {
    title: "Akses SNI",
    date: " April 27, 2021",
    desc: `Badan Standardisasi Nasional telah mengembangkan platform untuk membaca dokumen SNI secara “full-text” 
               dan gratis. Untuk dapat mengaksesnya silahkan kunjungi website akses-sni.bsn.go.id Tampilan halaman awal 
               adalah halaman login/registrasi. Jika belum memiliki akun, maka anda harus melakukan registrasi terlebih 
               dahulu untuk menikmati layanan ini. Yuk, baca dokumen SNI kapan pun dan di mana …`,
    link: "pagesNews/pages-10/content-96.html"
  },
  {
    title: "Library Clearance",
    date: " April 8, 2021",
    desc: `We hereby inform you that for students who have completed their studies but have not submitted their CD 
               to the library, that in order to get Clearance from Library, you need to:1. Submit 1 CD of the Thesis to 
               the library and include the following scans: a. Approval Sheet (fully …`,
    link: "pagesNews/pages-10/content-97.html"
  },
  {
    title: "New Office Hours",
    date: " March 29, 2021",
    desc: `Hello Presuniv,President University Adam Kurniawan Library gladly announced that we are now currently 
               open for public. Following regulation from the Campus, please note some of rules that you need to follow
               : Our operational hour is 08.00 until 17.00 Please Wear your mask. Social Distancing required in the 
               Library. Library’s maximum …`,
    link: "pagesNews/pages-10/content-98.html"
  },
  {
    title: "Adam Kurniawan Open For Public",
    date: " December 8, 2020",
    desc: `Hello Presuniv,President University Adam Kurniawan Library gladly announced that we are now currently 
               open for public. Following regulation from the Campus, please note some of rules that you need to follow: 
               Our operational hour is 09.30 until 15.00 Wearing your mask is a must. Social Distancing required. 
               Library’s maximum capacity …`,
    link: "pagesNews/pages-10/content-99.html"
  },
  {
    title: "Akses Koleksi Digital Perpustakaan Kemendikbud",
    date: " August 10, 2020",
    desc: `Sahabat Perpusdikbud, meskipun Perpusdikbud belum membuka layanan kepada publik secara langsung, Sahabat 
               Perpusdikbud tetap dapat mengakses koleksi digital Perpusdikbud melalui: Repositori Institusi 
               KemendikbudLayanan informasi digital yang menyediakan akses terbuka (open-access) dan daring (online) 
               kepada publik terkait dengan berbagai informasi dan publikasi di bidang pendidikan dan kebudayaan yang 
               dihasilkan oleh satuan …`,
    link: "pagesNews/pages-10/content-100.html"
  },
  // Pages 11 ==========================================================
  {
    title: "Free e-Resources List",
    date: " July 20, 2020",
    desc: `Dear All, To support your online learning activity at home and ‘work from home’ experience, Adam Kurniawan
               Library has made a summary about some publishers who provide free access to the valuable learning and reading 
               material you may need.Please refer to the list below: 1. Cambridge University Press:Cambridge University 
               Press …`,
    link: "pagesNews/pages-11/content-101.html"
  },
  {
    title: "Digital Access to the Library of the Ministry of Education and Culture of Indonesia",
    date: " July 20, 2020",
    desc: `Dear students and lecturers, To enrich your access to various reading material during COVID-19 pandemic, 
               the Ministry of Education of Culture of Indonesia (Kemendikbud) has made its library service online to 
               let the public gain access to its digital collection, as follows:1. Kemendikbud Institutional 
               RepositoryDigital information resource and open-access for …`,
    link: "pagesNews/pages-11/content-102.html"
  },
  {
    title: "Free Access to Journals and E-Books During the Pandemic Period",
    date: " March 30, 2020",
    desc: `Good news untuk peneliti. Beberapa penerbit besar memberi akses gratis pada ebook atau jurnal-jurnal 
               ilmiah selama masa pandemi. Silahkan cek: 1. Cambridge University Press: Cambridge University Press is 
               making higher education textbooks in HTML format free to access online during the coronavirus outbreak. 
               Over 700 textbooks, published and currently available …`,
    image: "assets/img/news/pages-11/border-69.png",
    link: "pagesNews/pages-11/content-103.html"
  },
  {
    title: "Adam Kurniawan Library Encourages Students to Actively Access the Online Resources at Home",
    date: " March 23, 2020",
    desc: `While President University has experienced a significant shift from face-to-face to online learning 
               activity, Adam Kurniawan Library also closed its face-to-face service, postponed and canceled public 
               events, such as guest lectures, workshops, etc. As part of an effort to ensure everyone’s health and 
               safety, Adam Kurniawan Library is providing essential …`,
    image: "assets/img/news/pages-11/border-70.jpg",
    link: "pagesNews/pages-11/content-104.html"
  },
  {
    title: "Chinese New Year",
    date: "February 12, 2019",
    desc: `Wednesday (6-8/ 2), Adam Kurniawan Library held a Chinese New Year 2019 in Library, 
               President University, Cikarang. The person who was participated by approximately 200 lecturers, staffs, 
               and students from President University.   Adam Kurniawan Library gave a special gift to the user who 
               wrote wish letter for this …`,
    image: "assets/img/news/pages-11/border-71.jpg",
    link: "pagesNews/pages-11/content-105.html"
  },
  {
    title: "Short Diplomatic Course",
    date: " October 22, 2018",
    desc: `. The world celebrates United Nations day every October 24, in order to make contribution Adam Kurniawan 
               Library supported by Bank Indonesia Corner and Yayasan Pengembangan Perpustakaan Indonesia will hold a 
               Short Diplomatic Course with theme “The Contribution of Youth to the World Peace”. The Event will hold on 
               Tuesday, …`,
    image: "assets/img/news/pages-11/border-72.jpg",
    link: "pagesNews/pages-11/content-106.html"
  },
  {
    title: "Indonesian Foreign Ministry",
    date: " August 21, 2018",
    desc: `Adam Kurniawan Library, President University – On August 19, 1945, the Indonesian Foreign Ministry was 
               formed. The 73rd anniversary of Indonesia Foreign Ministry. The vision is “The realization of diplomatic 
               authority to strengthen national identity as Maritime State for the Interest of the People.” With the 
               establishment of the Indonesian …`,
    image: "assets/img/news/pages-11/border-73.jpg",
    link: "pagesNews/pages-11/content-107.html"
  },
  {
    title: "HAPPY EID AL-ADHA",
    date: "August 21, 2018",
    desc: `The taking of one innocent life is like taking all of mankind… and the saving of one life is like saving 
               all of mankind. – Koran, 5:33 Sending you warm wishes on Eid Al-Adha and bring lots of happiness in your 
               life and may you celebrate it with all your …`,
    image: "assets/img/news/pages-11/border-74.jpg",
    link: "pagesNews/pages-11/content-108.html"
  },
  {
    title: "Indonesia Republic Constitution Day",
    date: " August 17, 2018",
    desc: `Adam Kurniawan Library, President University – Indonesia’s Constitutional Day was commemorated on August 
               18, 2008, when the Declaration of Indonesia’s Constitutional Day was adopted by the Institute for 
               Constitutional Studies, the Chairperson of the People’s Consultative Assembly, and the Chair and members 
               of the Regional Representative Council and various components …`,
    image: "assets/img/news/pages-11/border-75.jpg",
    link: "pagesNews/pages-11/content-109.html"
  },
  {
    title: "Independence Day",
    date: "August 17, 2018",
    desc: `Adam Kurniawan Library, President University – Indonesia’s Independence Day is a day that marks Indonesia
               as being declared independent from the Netherlands. Today is filled with celebrations and celebrations. 
               Despite the fact that Indonesia declared its independence from the Dutch Government on August 17, 1945, 
               it was not until 2005 that the …`,
    image: "assets/img/news/pages-11/border-76.jpg",
    link: "pagesNews/pages-11/content-110.html"
  },
  // Pages 12 ==========================================================
  {
    title: "Adam Kurniawan Competition",
    date: " August 16, 2018",
    desc: `Hello PresUnivers! We would like to share Adam Kurniawan Library Event “Welcoming Readers”, and also have
               Photo Contest and Writing Competition.`,
    image: "assets/img/news/pages-12/border-77.jpg",
    link: "pagesNews/pages-12/content-111.html"
  },
  {
    title: "Cooming Soon",
    date: " August 15, 2018",
    desc: `[COMING SOON] Hello PresUnivers !???? Our most awaited event “Welcoming Readers” The Writing Competition 
               and Photo Contest will be held really soon!`,
    image: "assets/img/news/pages-12/border-78.jpg",
    link: "pagesNews/pages-12/content-112.html"
  },
  {
    title: "Scout Day",
    date: " August 14, 2018",
    desc: `Adam Kurniawan Library, President University – Why is the scout day commemorated every August 14th? The 
               long journey of guiding movements brought by the Dutch since the colonial era, before Indonesian
               independence was swayed, but after the independence of the guiding movement or later known as scouts 
               always got their own appreciation …`,
    image: "assets/img/news/pages-12/border-79.jpg",
    link: "pagesNews/pages-12/content-113.html"
  },
  {
    title: "BI Corner “Inkuiri Menjawab Tantangan Literasi”",
    date: "August 9, 2018\n",
    desc: `Adam Kurniawan Library, President University – Hello Educators and Future Educators! ‍‍   Yuk hadiri 
               seminar yang bermanfaat untuk pendidik dan calon pendidik ...`,
    image: "assets/img/news/pages-12/border-80.jpg",
    link: "pagesNews/pages-12/content-114.html"
  },
  {
    title: "Technology Resurrection Day",
    date: " August 8, 2018",
    desc: `Adam Kurniawan Library, President University – Minister of Research Technology and Higher Education 
               (Menristekdikti) Mohamad Nasir, officially launched a series of activities to commemorate the 23rd 
               National Technology Awakening Day (Hakteknas) which will be held in Pekanbaru Riau on August 10, 2018.`,
    image: "assets/img/news/pages-12/border-81.jpg",
    link: "pagesNews/pages-12/content-115.html"
  },
  {
    title: "Asean Day",
    date: " August 8, 2018",
    desc: `Adam Kurniawan Library, President University –  On 8 August 1967, five leaders the Foreign Ministers of 
               Indonesia, Malaysia, the Philippines, Singapore, and Thailand sat down together in the main hall of the 
               Department of Foreign Affairs building in Bangkok, Thailand and signed a document. By virtue of that 
               document, the Association of …`,
    image: "assets/img/news/pages-12/border-82.jpg",
    link: "pagesNews/pages-12/content-116.html"
  },
  {
    title: "National Children’s Day",
    date: " July 23, 2018",
    desc: `Adam Kurniawan Library, President University – National Children’s Day is held all over the world to 
               help children to feel special and in National Children’s Day on Monday, July 23th 2018. This is the 
               perfect time for kids of all ages to get together and take part in a wide range of …`,
    image: "assets/img/news/pages-12/border-83.jpg",
    link: "pagesNews/pages-12/content-117.html"
  },
  {
    title: "[PRESUNIV ADAM KURNIAWAN LIBRARY: ANNOUNCEMENT ELECTRONIC JOURNAL ACCESS]",
    date: " July 25, 2018",
    desc: `Dear Presunivers, Adam Kurniawan Library, President University – Are grateful to inform you that 
               Kemenristekdikti has renewed subscriptions e-journals database EBSCO, Proquest, Cengage, which cover 
               the subject of education and culture. Everyone, including students, is welcomed to get the access. 
               >> The electronic journal access (In the attachment) <<`,
    image: "assets/img/news/pages-12/border-84.jpg",
    link: "pagesNews/pages-12/content-118.html"
  },
  {
    title: "13th Graduation President University",
    date: " July 20, 2018",
    desc: `Adam Kurniawan Library, President University –  Graduation day brings with it a roller coaster of 
               emotions for grads and their families alike. It’s a time of celebration and achievement.`,
    image: "assets/img/news/pages-12/border-85.jpg",
    link: "pagesNews/pages-12/content-119.html"
  },
  {
    title: "World Justice Day",
    date: "July 17, 2018",
    desc: `Adam Kurniawan Library, President University – International Day of Justice is an international day 
               celebrated worldwide on July 17 of each year as part of efforts to recognize the emerging international 
               criminal justice system. July 17 was chosen because it was the anniversary of the adoption of the Rome 
               Statute in July …`,
    image: "assets/img/news/pages-12/border-86.jpg",
    link: "pagesNews/pages-12/content-120.html"
  },
  // Pages 13 ==========================================================
  {
    title: "Indonesia Cooperative Day",
    date: " July 10, 2018",
    desc: `Adam Kurniawan Library, President University – Indonesia Cooperative Day is commemorated every July 12th.
               The important day came into effect when the Indonesia Cooperative Congress was held, the congress was the 
               first in Indonesia.`,
    image: "assets/img/news/pages-13/border-87.jpg",
    link: "pagesNews/pages-13/content-121.html"
  },
  {
    title: "Satelite Palapa Day",
    date: " July 9, 2018",
    desc: `Adam Kurniawan Library, President University – On July 9, Indonesia will commemorate Palapa Satellite Day.
               The satellite, taken from the name of the vow spoken by Majapahit’s patron, Gajah Mada, was launched in 
               1976 from Cape Canaveral, Florida, USA. When launched, the first Palapa satellite orbiting the Earth is 
               a generation A1. …`,
    image: "assets/img/news/pages-13/border-88.jpg",
    link: "pagesNews/pages-13/content-122.html"
  },
  {
    title: "Bank Indonesia Day",
    date: " July 5, 2018",
    desc: `Adam Kurniawan Library, President University – Bank Indonesia Day Hi, Innovation! Do you know that every 
               July 5, since 1946 Indonesia commemorate Bank Indonesia Day?`,
    image: "assets/img/news/pages-13/border-89.jpg",
    link: "pagesNews/pages-13/content-123.html"
  },
  {
    title: "Anti Drug Day",
    date: " June 25, 2018",
    desc: `Adam Kurniawan Library, President University – On World Drug Day, tomorrow, 26 June. The world will 
               commemorate the International Day against Drug Abuse and Illicit Trafficking, an occasion to drive 
               home the message that drug use can take a heavy toll on health and well-being. Today, however, there is 
               an alarming new …`,
    image: "assets/img/news/pages-13/border-90.jpg",
    link: "pagesNews/pages-13/content-124.html"
  },
  {
    title: "Eid al-Fitri",
    date: " June 21, 2018",
    desc: `Adam Kurniawan Library, President University – Assalamualaikum “Taqobbalallahu minna wa minkum”`,
    image: "assets/img/news/pages-13/border-91.jpg",
    link: "pagesNews/pages-13/content-125.html"
  },
  {
    title: "Happy Holiday",
    date: " June 20, 2018\n",
    desc: `Adam Kurniawan Library, President University – Wishes Enjoy the Holidays before Idul Fitri holidays for 
               everything`,
    image: "assets/img/news/pages-13/border-92.jpg",
    link: "pagesNews/pages-13/content-126.html"
  },
  {
    title: "Announcement",
    date: "June 6, 2018",
    desc: `Adam Kurniawan Library, President University – [ANNOUNCEMENT]`,
    image: "assets/img/news/pages-13/border-93.jpg",
    link: "pagesNews/pages-13/content-127.html"
  },
  {
    title: "National Pancasila Day",
    date: " June 1, 2018",
    desc: `Adam Kurniawan Library, President University – Do you remember on morning ceremony, whether at school 
               every Monday or Independence Day, we must vocalize all five points of Pancasila? It’s a powerful moment 
               where we always remember what makes Indonesia great and different with other countries.`,
    image: "assets/img/news/pages-13/border-94.jpg",
    link: "pagesNews/pages-13/content-128.html"
  },
  {
    title: "World Environment Day",
    date: "June 5, 2018",
    desc: `World Environment Day (WED), also known as Eco Day is widely celebrated on 5th June every year all over 
               the world. According to the UN General Assembly in 1972, this day laid importance to take measures to save 
               our environment in order to give a better life to our future generation. It was first held in 1974 and has 
               grown to become a public platform with a theme “Only One Earth”..`,
    image: "assets/img/news/pages-13/isi-konten-09.jpg",
    link: "pagesNews/pages-13/content-129.html"
  },
];

const slugify = (text) => {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const processedData = [];

console.log("Mulai Convert HTML ke Markdown dengan Absolute Image URL...");

articles.forEach((item, index) => {
  try {
    const relativePath = item.link.startsWith('/') ? item.link.substring(1) : item.link;
    const filePath = path.join(__dirname, relativePath);

    if (fs.existsSync(filePath)) {
      const htmlContent = fs.readFileSync(filePath, 'utf8');
      const $ = cheerio.load(htmlContent);

      const contentArea = $('section#seminar-article .container');

      contentArea.find('h1.post-title').remove();
      contentArea.find('.post-meta').remove();
      contentArea.find('.post-navigation-wrapper').remove();
      contentArea.find('a[href^="javascript:"]').remove();

      const baseUrl = "https://library.president.ac.id";

      contentArea.find('img').each((i, el) => {
        let src = $(el).attr('src');

        if (src && !src.startsWith('http')) {


          if (src.includes('assets/')) {
            src = '/assets/' + src.split('assets/')[1];
          } else if (!src.startsWith('/')) {
            src = '/' + src;
          }

          $(el).attr('src', baseUrl + src);
        }
      });

      let markdown = turndownService.turndown(contentArea.html());

      processedData.push({
        title: item.title,
        slug: slugify(item.title),
        content: markdown,
        date: new Date(item.date).toISOString(),
      });

      console.log(`✅ [${index + 1}] Beres: ${item.title}`);
    } else {
      console.warn(`⚠️ File gak ketemu: ${filePath}`);
    }

  } catch (err) {
    console.error(`❌ Error processing ${item.title}:`, err.message);
  }
});

fs.writeFileSync('news-content-full.json', JSON.stringify({ news: processedData }, null, 2));
console.log("\n🎉 Selesai! Image URL sekarang udah absolute ke library.president.ac.id");