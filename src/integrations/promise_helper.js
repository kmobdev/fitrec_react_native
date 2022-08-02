
/*
 * Sentry / Segment flush causing issues due to Promise.all log warning so found this band aid solution
 * it's not great but it suppresses the LogBox warning
 * https://stackoverflow.com/questions/66575667/promise-allsettled-is-not-a-function
 */


export const PromiseHelperAllSettled = (promises) => {
	return Promise.all(promises.map(function (promise) {
		return promise.then(function (value) {
			return { state: 'fulfilled', value: value };
		}).catch(function (reason) {
			return { state: 'rejected', reason: reason };
		});
	}));
};
