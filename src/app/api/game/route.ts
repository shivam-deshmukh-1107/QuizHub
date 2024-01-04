// import { prisma } from "@/lib/db";
// import { getAuthSession } from "@/lib/nextauth";
// import { QuizCreationSchema } from "@/schemas/form/quiz";
// import { NextResponse } from "next/server";
// import { z } from "zod";
// import axios from "axios";

// export async function POST(req: Request, res: Response) {
//   try {
//     const session = await getAuthSession();
//     if (!session?.user) {
//       return NextResponse.json(
//         {
//           error: "You must be logged in already!!",
//         },
//         {
//           status: 401,
//         }
//       );
//     }
//     const body = await req.json();
//     const { amount, topic, type } = QuizCreationSchema.parse(body);
//     const [game, { data }] = await Promise.all([
//       prisma.game.create({
//         data: {
//           gameType: type,
//           timeStarted: new Date(),
//           userId: session.user.id,
//           topic,
//         },
//       }),
//       axios.post(`${process.env.API_URL as string}/api/questions`, {
//         amount,
//         topic,
//         type,
//       }),
//     ]);

//     await prisma.topic_count.upsert({
//       where: {
//         topic,
//       },
//       create: {
//         topic,
//         count: 1,
//       },
//       update: {
//         count: {
//           increment: 1,
//         },
//       },
//     });

//     if (type === "mcq") {
//       type mcqQuestion = {
//         question: string;
//         answer: string;
//         option1: string;
//         option2: string;
//         option3: string;
//       };
//       const manyData = data.questions.map((question: mcqQuestion) => {
//         let options = [
//           question.option1,
//           question.option2,
//           question.option3,
//           question.answer,
//         ];
//         options.sort(() => Math.random() - 0.5);
//         return {
//           question: question.question,
//           answer: question.answer,
//           options: JSON.stringify(options),
//           gameId: game.id,
//           questionType: "mcq",
//         };
//       });
//       await prisma.question.createMany({
//         data: manyData,
//       });
//     } else if (type === "open_ended") {
//       type openQuestion = {
//         question: string;
//         answer: string;
//       };
//       const manydata = data.questions.map((question: openQuestion) => {
//         return {
//           question: question.question,
//           answer: question.answer,
//           gameId: game.id,
//           questionType: "open_ended",
//         };
//       });
//       await prisma.question.createMany({
//         data: manydata,
//       });
//     }
//     return NextResponse.json({
//       gameId: game.id,
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { error: error.issues },
//         {
//           status: 400,
//         }
//       );
//     } else {
//       return NextResponse.json(
//         { error: "An unexpected error occurred." },
//         {
//           status: 500,
//         }
//       );
//     }
//   }
// }

eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('c{g}a"@/E/1v";c{x}a"@/E/Z";c{I}a"@/10/11/12";c{e}a"13/14";c{z}a"Y";c o a"o";17 18 19 1a(J:1b,1c:16){X{8 n=9 x();k(!n?.H){d e.i({6:"S V O P Q R!!",},{q:U,})}8 F=9 J.i();8{s,f,4}=I.T(F);8[h,{b}]=9 1d.15([g.h.u({b:{1f:4,1t:1x 1y(),1z:n.H.l,f,},}),o.1A(`${1B.1C.1D 1E 3}/1F/m`,{s,f,4,}),]);9 g.1G.1H({1I:{f,},u:{f,A:1,},1e:{A:{1w:1,},},});k(4==="B"){4 t={2:3;7:3;r:3;w:3;v:3};8 y=b.m.C((2:t)=>{1g j=[2.r,2.w,2.v,2.7,];j.1u(()=>1s.1r()-0.5);d{2:2.2,7:2.7,j:1q.1p(j),p:h.l,K:"B",}});9 g.2.L({b:y,})}G k(4==="N"){4 D={2:3;7:3};8 M=b.m.C((2:D)=>{d{2:2.2,7:2.7,p:h.l,K:"N",}});9 g.2.L({b:M,})}d e.i({p:h.l,})}1o(6){k(6 1n z.1m){d e.i({6:6.1l},{q:1k,})}G{d e.i({6:"1j 1i 6 1h."},{q:W,})}}}',62,107,'||question|string|type||error|answer|const|await|from|data|import|return|NextResponse|topic|prisma|game|json|options|if|id|questions|session|axios|gameId|status|option1|amount|mcqQuestion|create|option3|option2|getAuthSession|manyData||count|mcq|map|openQuestion|lib|body|else|user|QuizCreationSchema|req|questionType|createMany|manydata|open_ended|be|logged|in|already|You|parse|401|must|500|try|zod|nextauth|schemas|form|quiz|next|server|all|Response|export|async|function|POST|Request|res|Promise|update|gameType|let|occurred|unexpected|An|400|issues|ZodError|instanceof|catch|stringify|JSON|random|Math|timeStarted|sort|db|increment|new|Date|userId|post|process|env|API_URL|as|api|topic_count|upsert|where'.split('|'),0,{}))
