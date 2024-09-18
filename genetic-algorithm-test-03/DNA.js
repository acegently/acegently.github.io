class DNA {

	// Constants
	GENES_MAX = 1500;
	GENES_AGE = 1;
	AGE_MAX = this.GENES_AGE * this.GENES_MAX;
	MUTATION_MULTI = 0.005;

	// Properties
	genes = [];

	constructor(xGenes) {
		if (xGenes) {
			this.genes = xGenes;
			return;
		}

		for (var i = 0; i < this.GENES_MAX; i++) {
			this.genes[i] = p5.Vector.random2D().normalize();
		}
	}

	GetGeneForce(xAge) {
		if (xAge > this.AGE_MAX) return;

		var stage = floor(xAge / this.GENES_AGE);
		return this.genes[floor(stage)];
	}

	breed(xPartnerDNA) {

	}

	// Mutate the DNA
	mutate() {
		for (var i = 0; i < this.genes.length; i++) {
			if (random() < this.MUTATION_MULTI) {
				this.genes[i] = p5.Vector.random2D();
			}
		}
	}
}


/* Breeding stuff
			} else {
				if (false) {
					//Binary wwap of genes between this and partner
					if (i % 2 == 0) {
						newGenes[i] = xPartner.genes[(i + 1) % xPartner.genes.length];
					} else {
						newGenes[i] = this.genes[i];
					}
				} else {
					//New Algorithm...
				}
*/