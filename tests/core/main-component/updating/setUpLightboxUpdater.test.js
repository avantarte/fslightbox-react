import { setUpLightboxUpdater } from "../../../../src/core/main-component/updating/setUpLightboxUpdater";
import { LightboxUpdatingActions } from "../../../../src/core/main-component/updating/LightboxUpdatingActions";

const lightboxUpdatingActions = {
    runIsOpenUpdateActions: () => {},
    runSlideUpdateActions: () => {}
};
const fsLightbox = {
    getters: {
        props: {
            getToggler: () => {},
            getSlide: () => {},
        }
    },
    componentsStates: {
        slide: {
            get: () => {}
        }
    },
    injector: {
        injectDependency: () => lightboxUpdatingActions,
    },
    core: {
        lightboxUpdater: {}
    }
};
const prevProps = {
    isOpen: false,
    slide: false
};

setUpLightboxUpdater(fsLightbox);

describe('injecting dependency', () => {
    beforeAll(() => {
        fsLightbox.injector.injectDependency = jest.fn(() => lightboxUpdatingActions);
        setUpLightboxUpdater(fsLightbox);
    });

    it('should inject LightboxUpdatingActions', () => {
        expect(fsLightbox.injector.injectDependency).toBeCalledWith(LightboxUpdatingActions);
    });

    afterAll(() => {
        fsLightbox.injector.injectDependency = () => lightboxUpdatingActions;
    })
});

describe('handling toggler', () => {
    beforeEach(() => {
        lightboxUpdatingActions.runIsOpenUpdateActions = jest.fn();
    });

    describe('toggler has not change', () => {
        beforeEach(() => {
            prevProps.toggler = true;
            fsLightbox.getters.props.getToggler = () => true;
            setUpLightboxUpdater(fsLightbox);
            fsLightbox.core.lightboxUpdater.handleUpdate(prevProps);
        });

        it('should not call runIsOpenUpdateActions', () => {
            expect(lightboxUpdatingActions.runIsOpenUpdateActions).not.toBeCalled();
        });
    });

    describe('toggler has changed', () => {
        beforeEach(() => {
            prevProps.toggler = false;
            fsLightbox.getters.props.getToggler = () => true;
            setUpLightboxUpdater(fsLightbox);
            fsLightbox.core.lightboxUpdater.handleUpdate(prevProps);
        });

        it('should call runIsOpenUpdateActions', () => {
            expect(lightboxUpdatingActions.runIsOpenUpdateActions).toBeCalled();
        });
    });
});

describe('handling slide', () => {
    beforeEach(() => {
        lightboxUpdatingActions.runSlideUpdateActions = jest.fn();
    });

    describe('not calling actions', () => {
        describe('due to slide prop has not changed even if slide prop !== slide state', () => {
            beforeEach(() => {
                prevProps.slide = 1;
                fsLightbox.getters.props.getSlide = () => 1;
                fsLightbox.componentsStates.slide.get = () => 2;
                setUpLightboxUpdater(fsLightbox);
                fsLightbox.core.lightboxUpdater.handleUpdate(prevProps);
            });

            it('should not call runSlideUpdateActions', () => {
                expect(lightboxUpdatingActions.runSlideUpdateActions).not.toBeCalled();
            });
        });

        describe('due to slide prop === state slide, even if slide prop has changed', () => {
            beforeEach(() => {
                prevProps.slide = 1;
                fsLightbox.getters.props.getSlide = () => 2;
                fsLightbox.componentsStates.slide.get = () => 2;
                setUpLightboxUpdater(fsLightbox);
                fsLightbox.core.lightboxUpdater.handleUpdate(prevProps);
            });

            it('should not call runSlideUpdateActions', () => {
                expect(lightboxUpdatingActions.runSlideUpdateActions).not.toBeCalled();
            });
        });
    });

    describe('calling actions', () => {
        describe('current and previous slide prop is not equal', () => {
            beforeEach(() => {
                prevProps.slide = 1;
                fsLightbox.getters.props.getSlide = () => 2;
                setUpLightboxUpdater(fsLightbox);
                lightboxUpdatingActions.runSlideUpdateActions = jest.fn();
            });

            describe('slide get is not set', () => {
                beforeEach(() => {
                    fsLightbox.componentsStates.slide.get = undefined;
                    fsLightbox.core.lightboxUpdater.handleUpdate(prevProps);
                });

                it('should call runSlideUpdateActions', () => {
                    expect(lightboxUpdatingActions.runSlideUpdateActions).toBeCalled();
                });
            });

            describe('slide state is set and it not equal to slide prop', () => {
                beforeEach(() => {
                    fsLightbox.componentsStates.slide.get = () => 1;
                    fsLightbox.core.lightboxUpdater.handleUpdate(fsLightbox);
                });

                it('should call runSlideUpdateActions', () => {
                    expect(lightboxUpdatingActions.runSlideUpdateActions).toBeCalled();
                });
            });
        });
    });
});
