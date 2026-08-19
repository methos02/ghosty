<?php

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use ReflectionException;
use ReflectionMethod;
use ReflectionParameter;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    /** @var array<string, mixed> */
    protected array $datas = [];

    /**
     * @throws ReflectionException
     */
    protected function hasFormRequest(string $class, string $method, string $formRequest): bool
    {
        $parameters = collect((new ReflectionMethod($class, $method))->getParameters());

        /** @var ReflectionParameter|null $requestParameter */
        $requestParameter = $parameters->first(fn (ReflectionParameter $parameter) => $parameter->name === 'request');

        return (string) $requestParameter?->getType() === $formRequest;
    }

    /**
     * @param  array<string, mixed>  $datas
     * @return array<string, mixed>
     */
    protected function getDatas(array $datas = []): array
    {
        return array_replace($this->datas, $datas);
    }
}
