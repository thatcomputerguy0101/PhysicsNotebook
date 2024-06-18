// TODO: pull custom units from equation packs

export default function modifyUnits(mjs)  {
    mjs = math;
    ({
        c: mjs.speedOfLight,
        a_g: mjs.gravity,
        h: mjs.planckConstant,
        R: mjs.gasConstant,
        m_e: mjs.electronMass,
        m_p: mjs.protonMass,
        m_n: mjs.neutronMass,
        // m_mu: mjs.muonMass,
        G: mjs.gravitationConstant,
        F: mjs.faraday,
        a_0: mjs.bohrRadius,
        r_e: mjs.classicalElectronRadius,
        k: mjs.boltzmann,
        q_e: mjs.elementaryCharge,
        u: mjs.atomicMass,
        epsilon_0: mjs.electricConstant,
        mu_0: mjs.magneticConstant,
        k: mjs.coulomb,
    })
}
