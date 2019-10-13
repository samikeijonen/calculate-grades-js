/*
 * Calculate grades via form input.
 *
 */
 ( function() {
	// Get form.
	const gradeForm = document.getElementById( 'js-calculate-grades' );

	// Bail if we do not have the form.
	if ( ! gradeForm ) {
		return;
	}

	// Get result div and default info from form.
	const showResults = document.getElementById( 'js-show-results' );

	// Max., min., and exam Fields.
	const maxPointsField = gradeForm.querySelector('[name="max-points"]');
	const minPointsField = gradeForm.querySelector('[name="min-points"]');
	const examPointsField = gradeForm.querySelector('[name="exam-points"]');

	// Points.
	let maxPoints;
	let minPoints;
	let examPoints;

	/**
	 * Calculate grade by given points.
	 *
	 * @param {number} max    Max points.
	 * @param {number} min    Min points.
	 * @param {number} points Exam points.
	 */
	function calculateGrade( max, min, points ) {
		// Linear: y= k(x - x_0) + y_0.
		const result = ( ( 10 - 4 ) / ( max - min ) ) * ( points - min ) + 4;
		const resultRound = ( Math.round( result * 4 ) / 4 ).toFixed( 2 );
		return resultRound >= 4 ? resultRound : 4;
	}

	/**
	 * Populate grades table.
	 *
	 * @param {object} grades All the grades.
	 * @param {number} points Student points.
	 */
	 function populateTable( grades, points ) {
		return resultTable = `
			<table>
				<caption class="sr-only">Grade table</caption>
				<tr>
					<th scope="col">Points</th>
					<th scope="col">Grade</th>
				</tr>
				${ grades.map( grade => `
				<tr class="${ grade.point == points && points ? 'results has-result-match' : 'results' }">
					<td>${ grade.point }</td>
					<td>${ grade.result }</td>
				</tr>
				`).join('') }
			</table>
			`.trim();
	}

	/**
	 * Populate grades in table format.
	 *
	 * @param {number} max    Max points.
	 * @param {number} min    Min points.
	 * @param {number} points Exam points.
	 */
	function populateResults( max, min, points ) {
		// Add grades to array. We can sort and use template strings after that.
		let grades = [];
		for ( let i = max; i >= min; i-- ) {
			grades[i] = {
				point: i,
				result: parseFloat( calculateGrade( max, min, i ) ),
			};
		}

		// Reverse the order at first.
		grades.reverse();

		// Get our populated table.
		let resultTable = populateTable( grades, points );

		// Populate results inside our div.
		showResults.innerHTML = resultTable;
	}

	/**
	 * Calculate grade via form input.
	 *
	 * @param {object} e Element to check.
	 */
	function calculateGrades( e ) {
		// Don't reload the page.
		e.preventDefault();

		// Populate points from usual points if that's the target.
		if ( 'usual-max-points' === e.target.name ) {
			// Get values and data from radio fields.
			const usualMaxValue = parseInt( e.target.value );
			const usualMinValue = parseInt( e.target.getAttribute( 'data-min-points' ) );

			maxPoints = parseInt( maxPointsField.value = usualMaxValue );
			minPoints = parseInt( minPointsField.value = usualMinValue );
		}

		// Get values from form fields.
		maxPoints = parseInt( maxPointsField.value );
		minPoints = parseInt( minPointsField.value );
		examPoints = parseInt( examPointsField.value );

		// Populate grade table.
		populateResults( maxPoints, minPoints, examPoints );
	}

	// Listen when the form is submitted.
	gradeForm.addEventListener( 'submit', calculateGrades, false );

	// Listen when form fields have changed.
	gradeForm.addEventListener( 'input', calculateGrades, false );

	// Populate first grade table on page load.
	window.addEventListener( 'load', calculateGrades, false );
} )();
