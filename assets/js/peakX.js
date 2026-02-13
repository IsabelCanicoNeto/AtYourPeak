document.addEventListener("DOMContentLoaded", () => {

    console.log("supabase");
  /* ---------- Supabase config ---------- */
  const supabaseUrl = "https://duttonvdzfdhobdmhuta.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1dHRvbnZkemZkaG9iZG1odXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyODIyMTQsImV4cCI6MjA4NDg1ODIxNH0.Ym4T_czeVOL6l3sYO6azy0sMAp9X8v-n-EUCs-dMDCY";

  const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
  );

  /* ---------- Form Submission ---------- */
  const form = document.getElementById("questionform");
  const status = document.getElementById("status");

  if (!form) {
    console.error("Form with id='questionform' not found");
    return;
  }
    console.log("form");
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("dentro form");
    status.textContent = "Submitting...";

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    /* ---------- IMPORTANT: numeric conversion ---------- */
    const n = v => Number(v) || 0;

    const peakx_A = n(data.hotflashes) + n(data.sleep) + n(data.energy) +
                    n(data.heart) + n(data.hear) + n(data.joints) + n(data.weight);
    const peakx_Ar = peakx_A / 21 * 30;

    const peakx_B = n(data.feelingnervous) + n(data.relax) +
                    n(data.feelingdown) + n(data.concetration) + n(data.motivation);
    const peakx_Br = peakx_B / 15 * 25;

    const peakx_C = n(data.regularity) + n(data.pattern) +
                    n(data.libido) + n(data.vaginal);
    const peakx_Cr = peakx_C / 15 * 20;

    const peakx_D = n(data.sleepquality) + n(data.nightsweek) + n(data.walking);
    const peakx_Dr = peakx_D / 15 * 15;

    const peakx_E = n(data.lifestyle) + n(data.sleepnight) + n(data.stresslevel);
    const peakx_Er = peakx_E / 15 * 15;

    const peakx_R = peakx_Ar + peakx_Br + peakx_Cr + peakx_Dr + peakx_Er;

    console.log("form data", data);

    let peakx_Desc;
    if (peakx_R >= 75) {
      peakx_Desc = "Probable Menopause, Personalized care plan recommended";
    } else if (peakx_R >= 50) {
      peakx_Desc = "Probable perimenopause, share report with clinician";
    } else if (peakx_R >= 25) {
      peakx_Desc = "Possible early transition, Monitor the results and opt-in to sleep and stress program";
    } else {
      peakx_Desc = "Stable hormonal phase. Maintain lifestyle – retake in 6 months";
    }

    console.log("Ar:", peakx_Ar, "Br:", peakx_Br, "Cr:", peakx_Cr, "Dr:", peakx_Dr, "Er:", peakx_Er, "Total:", peakx_R, "Descr:", peakx_Desc);

    document.getElementById("peakx_result").textContent = peakx_R.toFixed(1);
    document.getElementById("peakx_descr").textContent = peakx_Desc;

    const { error } = await supabaseClient
      .from("responses")
      .insert([{
          consent: true,
        age: Number(data.age) || null,
        lastdate: data.lastdate || null,

        anxiety: data.anxiety || false,
        depression: data.depression || false,
        otherdiseases: data.otherdiseases || null,

        anxietyF: data.anxietyF || false,
        depressionF: data.depressionF || false,
        otherdiseasesF: data.otherdiseasesF || null,

        hotflashes: data.hotflashes || null,
        sleep: data.sleep || null,
        energy: data.energy || null,
        heart: data.heart || null,
        hear: data.hear || null,
        joints: data.joints || null,
        weight: data.weight || null,
        feelingnervous: data.feelingnervous || null,
        relax: data.relax || null,
        feelingdown: data.feelingdown || null,
        concetration: data.concetration || null,
        motivation: data.motivation || null,
        regularity: data.regularity || null,
        pattern: data.pattern || null,
        libido: data.libido || null,
        vaginal: data.vaginal || null,
        sleepquality: data.sleepquality || null,
        nightsweek: data.nightsweek || null,
        walking: data.walking || null,
        lifestyle: data.lifestyle || null,
        sleepnight: data.sleepnight || null,
        stresslevel: data.stresslevel || null,

        peakx_rating: peakx_R
      }]);

    if (error) {
      console.error(error);
      status.textContent = "Submission failed. Please try again.";
    } else {
      status.textContent = "Thank you! Your responses were recorded.";
      form.reset();
    }
  });
});


