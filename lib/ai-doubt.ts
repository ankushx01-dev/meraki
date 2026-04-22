export type ConversationRole = "user" | "assistant";

export type ConversationMessage = {
  role: ConversationRole;
  content: string;
};

export type AIDoubtReply = {
  answer: string;
  tip: string;
  warning: string;
};

export type AIDoubtSource = "openai" | "fallback";

export const AI_DOUBT_SYSTEM_PROMPT = [
  "You are a certified fitness trainer and nutrition expert.",
  "Give clear, short, beginner-friendly answers.",
  "Always explain WHY.",
  "Include practical tips.",
  "Avoid unsafe advice.",
].join("\n");

export const AI_DOUBT_FORMAT_INSTRUCTIONS = [
  "Return valid JSON that matches the provided schema.",
  "Keep the answer concise and practical for a beginner fitness app user.",
  "Use the warning field only for meaningful safety concerns such as injuries, medical conditions, dehydration, extreme calorie restriction, or supplement misuse.",
  "If no warning is needed, return an empty string.",
].join(" ");

export const AI_DOUBT_SUGGESTED_QUESTIONS = [
  "How to lose fat without losing muscle?",
  "What should I eat before a workout?",
  "Why am I not gaining muscle?",
  "How much protein do I need daily?",
  "Is cardio bad for muscle gain?",
  "What should beginners do on rest days?",
];

export function formatAIDoubtReply(reply: AIDoubtReply) {
  const sections = [`Answer\n${reply.answer}`, `Tip\n${reply.tip}`];

  if (reply.warning.trim()) {
    sections.push(`Warning\n${reply.warning.trim()}`);
  }

  return sections.join("\n\n");
}

function includesAny(input: string, keywords: string[]) {
  return keywords.some((keyword) => input.includes(keyword));
}

function createReply(answer: string, tip: string, warning = ""): AIDoubtReply {
  return { answer, tip, warning };
}

export function getFallbackAIDoubtReply(question: string): AIDoubtReply {
  const normalized = question.trim().toLowerCase();

  if (includesAny(normalized, ["lose fat", "fat loss", "cutting", "cut ", "deficit"])) {
    return createReply(
      [
        "To lose fat without losing muscle, keep the calorie deficit small, keep protein high, and keep lifting.",
        "",
        "Why: fat loss comes from eating slightly less than you burn, but muscle stays better protected when your body still gets enough protein and a strong training signal.",
        "",
        "Try this:",
        "1. Aim for a 10 to 20 percent calorie deficit.",
        "2. Eat about 1.6 to 2.2 g of protein per kg of body weight daily.",
        "3. Strength train 3 to 5 times per week.",
        "4. Sleep 7 to 9 hours so recovery stays solid.",
      ].join("\n"),
      "Make your first priority consistency: protein, lifting, steps, and sleep done well every week beats an aggressive diet you cannot maintain.",
      "Avoid extreme calorie restriction. It can increase muscle loss, fatigue, and poor workout performance.",
    );
  }

  if (includesAny(normalized, ["protein", "how much protein", "grams of protein"])) {
    return createReply(
      [
        "For most people trying to build or keep muscle, a good target is 1.6 to 2.2 grams of protein per kilogram of body weight per day.",
        "",
        "Why: protein supports muscle repair, recovery, fullness, and muscle retention during fat loss.",
        "",
        "Example: if you weigh 70 kg, aim for roughly 112 to 154 g per day.",
      ].join("\n"),
      "Split protein across 3 to 5 meals so each meal gives your body a steady recovery signal.",
      "If you have kidney disease or a medically restricted diet, ask a qualified professional before increasing protein.",
    );
  }

  if (includesAny(normalized, ["before a workout", "pre workout", "eat before"])) {
    return createReply(
      [
        "A simple pre-workout meal is carbs plus some protein 60 to 120 minutes before training.",
        "",
        "Why: carbs help fuel the session and protein supports muscle recovery and performance.",
        "",
        "Easy options:",
        "- banana with yogurt",
        "- oats with milk",
        "- toast with eggs",
        "- rice and chicken if you have more time",
      ].join("\n"),
      "If you train early and cannot eat much, even a banana or a small protein shake is better than nothing.",
      "Avoid very heavy, greasy meals right before training because they can make you feel sluggish or nauseous.",
    );
  }

  if (includesAny(normalized, ["not gaining muscle", "gain muscle", "building muscle"])) {
    return createReply(
      [
        "If you are not gaining muscle, the usual reasons are not enough calories, not enough protein, weak training progression, or poor recovery.",
        "",
        "Why: muscle growth needs both building material and a reason to adapt.",
        "",
        "Check these first:",
        "1. Eat enough total calories.",
        "2. Hit your protein target daily.",
        "3. Progress your lifts over time.",
        "4. Sleep well and recover properly.",
      ].join("\n"),
      "Track body weight, workout performance, and protein for 2 to 3 weeks before making another big change.",
      "Do not keep changing your program every few days. Muscle gain needs repeated effort and patience.",
    );
  }

  if (includesAny(normalized, ["cardio", "bad for muscle gain"])) {
    return createReply(
      [
        "Cardio is not bad for muscle gain when the amount is reasonable and recovery is managed well.",
        "",
        "Why: moderate cardio helps heart health, work capacity, and calorie control. It only becomes a problem when it is so hard or frequent that it hurts recovery from lifting.",
        "",
        "A good starting point is 2 to 3 light or moderate sessions per week.",
      ].join("\n"),
      "Keep intense cardio away from your hardest leg sessions when possible.",
      "Too much high-intensity cardio plus low calories can reduce recovery and make muscle gain harder.",
    );
  }

  if (includesAny(normalized, ["rest day", "rest days", "day off"])) {
    return createReply(
      [
        "Beginners should use rest days for recovery, light movement, and better habits, not complete laziness.",
        "",
        "Why: your body adapts and grows when it has time to recover from training stress.",
        "",
        "Good rest-day basics:",
        "1. Walk and stay lightly active.",
        "2. Eat enough protein and fluids.",
        "3. Stretch or do gentle mobility if you feel stiff.",
        "4. Sleep well.",
      ].join("\n"),
      "A short walk after meals is one of the easiest recovery habits to stay consistent with.",
      "If you are very sore, do not add more hard training just because you feel guilty about resting.",
    );
  }

  if (includesAny(normalized, ["creatine", "supplement"])) {
    return createReply(
      [
        "Creatine monohydrate is the most useful basic supplement for strength and muscle gain for many people.",
        "",
        "Why: it helps your muscles produce energy during hard effort, which can improve training quality over time.",
        "",
        "A common approach is 3 to 5 g per day, every day.",
      ].join("\n"),
      "Pick a simple, plain creatine monohydrate product instead of overcomplicated blends.",
      "Supplements help less than sleep, calories, protein, and consistent training. Fix the basics first.",
    );
  }

  if (includesAny(normalized, ["sore", "soreness", "doms"])) {
    return createReply(
      [
        "Mild soreness is normal, especially when you are new or change your program.",
        "",
        "Why: your body is adapting to a training stress it is not fully used to yet.",
        "",
        "What helps:",
        "1. Light walking or mobility",
        "2. Good sleep",
        "3. Enough protein and fluids",
        "4. Not jumping too fast in volume next session",
      ].join("\n"),
      "Use soreness as feedback, not as proof of a good workout. Progress matters more than pain.",
      "Sharp pain, swelling, numbness, or pain that changes movement quality is not normal soreness and should be assessed properly.",
    );
  }

  if (includesAny(normalized, ["water", "hydration", "dehydrated"])) {
    return createReply(
      [
        "A simple hydration rule is to drink consistently through the day and add more around training, heat, and sweating.",
        "",
        "Why: even mild dehydration can hurt performance, energy, and recovery.",
        "",
        "A practical check is pale yellow urine and steady energy through the day.",
      ].join("\n"),
      "Carry one bottle and refill it a few times per day instead of waiting until you feel very thirsty.",
      "If you train hard in heat and sweat a lot, include electrolytes as well as water.",
    );
  }

  if (includesAny(normalized, ["sleep", "recovery"])) {
    return createReply(
      [
        "Sleep is one of the biggest performance and body-composition tools you have.",
        "",
        "Why: good sleep supports hormone balance, hunger control, recovery, focus, and workout quality.",
        "",
        "A strong target for most adults is 7 to 9 hours per night.",
      ].join("\n"),
      "Keep your sleep and wake times consistent before trying fancy recovery methods.",
      "If you have long-term severe sleep issues, constant fatigue, or snoring concerns, get proper medical support.",
    );
  }

  return createReply(
    [
      "A good beginner fitness answer usually starts with your goal, your current routine, and what is not working right now.",
      "",
      "Why: the best advice depends on whether you want fat loss, muscle gain, better energy, or recovery.",
      "",
      "In general, focus on these basics first:",
      "1. Train consistently",
      "2. Eat enough protein",
      "3. Manage calories based on your goal",
      "4. Sleep well",
      "5. Stay patient for a few weeks before judging results",
    ].join("\n"),
    "If you want a more specific answer, include your age, weight, goal, workout routine, and diet pattern.",
  );
}
